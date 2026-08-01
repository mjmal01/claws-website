'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function createNewsPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (session.user.role !== 'leadership') throw new Error('Forbidden')

  const supabase = await createServerSupabaseClient()

  const title = (formData.get('title') as string)?.trim()
  const body = (formData.get('body') as string)?.trim()
  const imageUrl = (formData.get('image_url') as string) || null

  if (!title || !body) throw new Error('Title and body required')

  const { error } = await supabase.from('news_posts').insert({
    title,
    body,
    image_url: imageUrl,
    author_id: session.user.id,
    published: true,
  })

  if (error) throw new Error(error.message)

  // Notify all active members
  const { data: members } = await supabase
    .from('members')
    .select('id')
    .eq('active', true)
    .neq('id', session.user.id)

  if (members && members.length > 0) {
    const rows = (members as { id: string }[]).map((m) => ({
      member_id: m.id,
      type: 'announcement' as const,
      message: `New announcement: "${title}"`,
    }))
    await supabase.from('notifications').insert(rows)
  }

  revalidatePath('/members/news')
  revalidatePath('/members')
  return { ok: true }
}

export async function deleteNewsPost(postId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (session.user.role !== 'leadership') throw new Error('Forbidden')

  const supabase = await createServerSupabaseClient()
  await supabase.from('news_posts').delete().eq('id', postId)

  revalidatePath('/members/news')
  revalidatePath('/members/manage/news')
  return { ok: true }
}
