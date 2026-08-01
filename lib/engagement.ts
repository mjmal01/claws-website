import { createServerSupabaseClient } from './supabase'
import type { EventType, MemberBadge, Member, Badge } from './supabase'

export const POINTS = {
  attendance: { all_hands: 15, subteam: 10, outreach: 20, milestone: 30, jsc: 100 },
  task:       { base: 15, early_bonus: 5, subteam_wide: 10 },
  engagement: {
    first_checkin: 25, onboarding_complete: 50,
    spotlight: 40, streak_5: 30, streak_10: 75,
  },
  semester_minimum: 150,
} as const

export const BADGE_SLUGS = {
  FIRST_CHECKIN:       'first-checkin',
  STREAK_5:            'streak-5',
  STREAK_10:           'streak-10',
  TASK_MASTER:         'task-master',
  ONBOARDING_COMPLETE: 'onboarding-complete',
  SPOTLIGHT:           'spotlight',
  JSC_ATTENDEE:        'jsc-attendee',
} as const

export async function awardAttendancePoints(memberId: string, eventType: EventType): Promise<number> {
  const pts = POINTS.attendance[eventType]
  const supabase = await createServerSupabaseClient()
  await supabase.rpc('award_points', { p_member_id: memberId, p_points: pts })
  await supabase.from('notifications').insert({
    member_id: memberId, type: 'attendance',
    message: `+${pts} points for attending a ${eventType.replace('_', '-')} event`,
  })
  return pts
}

export async function awardTaskPoints(
  memberId: string, taskTitle: string, pointsValue: number, isEarly: boolean
): Promise<number> {
  const total = pointsValue + (isEarly ? POINTS.task.early_bonus : 0)
  const supabase = await createServerSupabaseClient()
  await supabase.rpc('award_points', { p_member_id: memberId, p_points: total })
  await supabase.from('notifications').insert({
    member_id: memberId, type: 'task',
    message: isEarly
      ? `+${total} points for completing "${taskTitle}" early`
      : `+${total} points for completing "${taskTitle}"`,
  })
  return total
}

function isoWeekKey(date: Date): string {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  )
  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`
}

function isoWeekOffset(base: Date, offsetWeeks: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + offsetWeeks * 7)
  return isoWeekKey(d)
}

export async function recalculateStreak(memberId: string): Promise<number> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('attendance').select('checked_in').eq('member_id', memberId)
    .order('checked_in', { ascending: false })

  const rows = (data ?? []) as Array<{ checked_in: string }>
  if (rows.length === 0) {
    await supabase.from('members').update({ streak: 0 }).eq('id', memberId)
    return 0
  }

  const weeks = new Set(rows.map((r) => isoWeekKey(new Date(r.checked_in))))
  const sorted = Array.from(weeks).sort().reverse()
  let streak = 0
  const now = new Date()
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] === isoWeekOffset(now, -i)) streak++
    else break
  }

  await supabase.from('members').update({ streak }).eq('id', memberId)
  return streak
}

export async function awardBadge(memberId: string, badgeSlug: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('badges').select('label, points').eq('slug', badgeSlug).single()
  const badge = data as Pick<Badge, 'label' | 'points'> | null
  if (!badge) return

  await supabase.from('member_badges').insert({ member_id: memberId, badge_slug: badgeSlug })
  if (badge.points > 0) {
    await supabase.rpc('award_points', { p_member_id: memberId, p_points: badge.points })
  }
  await supabase.from('notifications').insert({
    member_id: memberId, type: 'badge',
    message: `You earned the "${badge.label}" badge!`,
  })
}

export async function checkAndAwardBadges(memberId: string): Promise<string[]> {
  const supabase = await createServerSupabaseClient()
  const awarded: string[] = []

  const { data: existingData } = await supabase
    .from('member_badges').select('badge_slug').eq('member_id', memberId)
  const alreadyEarned = new Set(
    ((existingData ?? []) as Pick<MemberBadge, 'badge_slug'>[]).map((b) => b.badge_slug)
  )

  const { data: memberData } = await supabase
    .from('members').select('streak, points').eq('id', memberId).single()
  const member = memberData as Pick<Member, 'streak' | 'points'> | null
  if (!member) return []

  if (member.streak >= 5  && !alreadyEarned.has(BADGE_SLUGS.STREAK_5))  { await awardBadge(memberId, BADGE_SLUGS.STREAK_5);  awarded.push(BADGE_SLUGS.STREAK_5) }
  if (member.streak >= 10 && !alreadyEarned.has(BADGE_SLUGS.STREAK_10)) { await awardBadge(memberId, BADGE_SLUGS.STREAK_10); awarded.push(BADGE_SLUGS.STREAK_10) }

  const { count } = await supabase
    .from('tasks').select('*', { count: 'exact', head: true })
    .eq('member_id', memberId).eq('completed', true)
  if ((count ?? 0) >= 10 && !alreadyEarned.has(BADGE_SLUGS.TASK_MASTER)) {
    await awardBadge(memberId, BADGE_SLUGS.TASK_MASTER)
    awarded.push(BADGE_SLUGS.TASK_MASTER)
  }

  return awarded
}

export async function awardFirstCheckin(memberId: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const { count } = await supabase
    .from('attendance').select('*', { count: 'exact', head: true }).eq('member_id', memberId)
  if ((count ?? 0) === 1) {
    await supabase.rpc('award_points', { p_member_id: memberId, p_points: POINTS.engagement.first_checkin })
    await supabase.from('notifications').insert({
      member_id: memberId, type: 'attendance',
      message: `+${POINTS.engagement.first_checkin} points for your first CLAWS check-in!`,
    })
    await awardBadge(memberId, BADGE_SLUGS.FIRST_CHECKIN)
  }
}

export async function updateMemberStatus(memberId: string, semesterWeek: number): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('members').select('points, status').eq('id', memberId).single()
  const member = data as Pick<Member, 'points' | 'status'> | null
  if (!member) return

  let newStatus: Member['status'] = 'active'
  if (semesterWeek >= 12 && member.points < 75) newStatus = 'review'
  else if (semesterWeek >= 8 && member.points < POINTS.semester_minimum) newStatus = 'at_risk'

  if (newStatus !== member.status) {
    await supabase.from('members').update({ status: newStatus }).eq('id', memberId)
    if (newStatus === 'at_risk') {
      await supabase.from('notifications').insert({
        member_id: memberId, type: 'warning',
        message: `You are below the ${POINTS.semester_minimum} point minimum for this semester.`,
      })
    }
  }
}
