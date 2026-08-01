import { createServerSupabaseClient } from './supabase'
import type { Member, MemberStatus } from './supabase'
import { POINTS } from './engagement'

export interface MembershipReport {
  memberId: string
  points: number
  attendanceRate: number
  taskCompletionRate: number
  unexcusedAbsences: number
  overdueTaskCount: number
  status: MemberStatus
  warnings: string[]
}

const REQUIREMENTS = {
  attendance_min_pct:  0.70,
  task_completion_pct: 0.80,
  max_overdue_tasks:   2,
  grace_unexcused:     1,
} as const

export async function calculateMembershipStatus(
  memberId: string,
  semesterWeek: number
): Promise<MembershipReport> {
  const supabase = await createServerSupabaseClient()

  const { data: memberData } = await supabase
    .from('members').select('points, status').eq('id', memberId).single()
  const member = memberData as Pick<Member, 'points' | 'status'> | null
  if (!member) throw new Error('Member not found')

  const { count: totalEvents }   = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: attended }      = await supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('member_id', memberId)
  const { count: excusedCount }  = await supabase.from('absence_requests').select('*', { count: 'exact', head: true }).eq('member_id', memberId).eq('status', 'approved')
  const { count: totalTasks }    = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('member_id', memberId)
  const { count: completedTasks }= await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('member_id', memberId).eq('completed', true)
  const { count: overdueTasks }  = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('member_id', memberId).eq('completed', false).lt('due_date', new Date().toISOString().split('T')[0])

  const total   = totalEvents ?? 0
  const present = attended ?? 0
  const excused = excusedCount ?? 0
  const unexcusedAbsences  = Math.max(0, (total - present) - excused - REQUIREMENTS.grace_unexcused)
  const attendanceRate     = total > 0 ? (present + excused) / total : 1
  const overdueTaskCount   = overdueTasks ?? 0
  const taskTotal          = totalTasks ?? 0
  const taskCompletionRate = taskTotal > 0 ? (completedTasks ?? 0) / taskTotal : 1

  const warnings: string[] = []
  let status: MemberStatus = 'active'

  if (semesterWeek >= 8 && member.points < POINTS.semester_minimum) {
    warnings.push(`Below ${POINTS.semester_minimum} point minimum`)
    status = 'at_risk'
  }
  if (semesterWeek >= 12 && member.points < 75) {
    warnings.push('Below 75 points at week 12 — leadership review triggered')
    status = 'review'
  }
  if (attendanceRate < REQUIREMENTS.attendance_min_pct) {
    warnings.push(`Attendance ${Math.round(attendanceRate * 100)}% is below the 70% requirement`)
    if (status === 'active') status = 'at_risk'
  }
  if (taskCompletionRate < REQUIREMENTS.task_completion_pct) {
    warnings.push(`Task completion ${Math.round(taskCompletionRate * 100)}% is below the 80% requirement`)
    if (status === 'active') status = 'at_risk'
  }
  if (overdueTaskCount > REQUIREMENTS.max_overdue_tasks) {
    warnings.push(`${overdueTaskCount} overdue tasks — maximum is ${REQUIREMENTS.max_overdue_tasks}`)
    if (status === 'active') status = 'at_risk'
  }

  if (status !== member.status) {
    await supabase.from('members').update({ status }).eq('id', memberId)
  }

  return { memberId, points: member.points, attendanceRate, taskCompletionRate, unexcusedAbsences, overdueTaskCount, status, warnings }
}

export async function runWeeklyStatusCheck(semesterWeek: number): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('members').select('id').eq('active', true).eq('role', 'member')
  for (const { id } of (data ?? []) as Array<{ id: string }>) {
    await calculateMembershipStatus(id, semesterWeek)
  }
}

export function canAccessPortal(_member: Pick<Member, 'active' | 'status' | 'role'>): boolean {
  return true // all active + alumni get portal access, restricted per feature
}

export function canAccessTasks(member: Pick<Member, 'status'>): boolean {
  return member.status !== 'inactive'
}

export function canAccessMerch(member: Pick<Member, 'status' | 'role'>): boolean {
  if (member.role === 'alumni') return false
  return member.status !== 'inactive'
}
