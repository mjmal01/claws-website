'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { SubteamSlug } from '@/lib/supabase'

export async function completeTask(taskId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const supabase = await createServerSupabaseClient()

  // Verify task belongs to this member
  const { data: task } = await supabase
    .from('tasks')
    .select('id, member_id, points_value, due_date, completed')
    .eq('id', taskId)
    .single()

  if (!task || task.member_id !== session.user.id) throw new Error('Forbidden')
  if (task.completed) return { ok: true }

  const completedAt = new Date().toISOString()
  const dueDate = task.due_date ? new Date(task.due_date) : null
  const isEarly = dueDate && new Date(completedAt) < new Date(dueDate.getTime() - 2 * 86400000)

  await supabase
    .from('tasks')
    .update({ completed: true, completed_at: completedAt })
    .eq('id', taskId)

  // Award points
  const basePoints: number = task.points_value ?? 15
  const bonus = isEarly ? 5 : 0
  await supabase.rpc('increment_member_points', {
    p_member_id: session.user.id,
    p_points: basePoints + bonus,
  }).throwOnError().maybeSingle()

  // Create notification for bonus
  if (bonus > 0) {
    await supabase.from('notifications').insert({
      member_id: session.user.id,
      type: 'task',
      message: `+${bonus}pts early completion bonus!`,
    })
  }

  revalidatePath('/members/tasks')
  revalidatePath('/members')
  return { ok: true }
}

export async function uncompleteTask(taskId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')

  const supabase = await createServerSupabaseClient()
  const { data: task } = await supabase
    .from('tasks')
    .select('id, member_id')
    .eq('id', taskId)
    .single()

  if (!task || task.member_id !== session.user.id) throw new Error('Forbidden')

  await supabase
    .from('tasks')
    .update({ completed: false, completed_at: null })
    .eq('id', taskId)

  revalidatePath('/members/tasks')
  revalidatePath('/members')
  return { ok: true }
}

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (!['leadership', 'member'].includes(session.user.role)) throw new Error('Forbidden')

  const supabase = await createServerSupabaseClient()

  // Verify assignee exists if provided
  const memberId = (formData.get('member_id') as string) || null
  const subteam = (formData.get('subteam') as SubteamSlug) || null
  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const dueDateRaw = formData.get('due_date') as string
  const dueDate = dueDateRaw || null
  const pointsValue = parseInt((formData.get('points_value') as string) || '15', 10)

  if (!title?.trim()) throw new Error('Title required')

  const { data, error } = await supabase.from('tasks').insert({
    member_id: memberId,
    subteam,
    title: title.trim(),
    description,
    due_date: dueDate,
    assigned_by: session.user.id,
    points_value: pointsValue,
  }).select().single()

  if (error) throw new Error(error.message)

  // Notify assignee
  if (memberId) {
    await supabase.from('notifications').insert({
      member_id: memberId,
      type: 'task',
      message: `New task assigned: "${title.trim()}"${dueDate ? ` · due ${new Date(dueDate).toLocaleDateString()}` : ''}`,
    })
  }

  revalidatePath('/members/manage/tasks')
  revalidatePath('/members/tasks')
  return { ok: true, taskId: (data as { id: string }).id }
}

export async function deleteTask(taskId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (session.user.role !== 'leadership') throw new Error('Forbidden')

  const supabase = await createServerSupabaseClient()
  await supabase.from('tasks').delete().eq('id', taskId)

  revalidatePath('/members/manage/tasks')
  return { ok: true }
}
