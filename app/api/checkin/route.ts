import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateQrToken, recordCheckin } from '@/lib/qr'
import { awardAttendancePoints, awardFirstCheckin, recalculateStreak, checkAndAwardBadges } from '@/lib/engagement'
import { createServerSupabaseClient } from '@/lib/supabase'
import { sendCheckinDM } from '@/lib/slack'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { token?: string }
  const token = body.token

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  // Validate QR token
  const { valid, eventId, reason } = await validateQrToken(token)
  if (!valid || !eventId) {
    return NextResponse.json({ error: reason ?? 'Invalid QR code' }, { status: 400 })
  }

  // Record attendance
  const { success, duplicate } = await recordCheckin(session.user.id, eventId)
  if (duplicate) {
    return NextResponse.json({ error: 'Already checked in to this event' }, { status: 409 })
  }
  if (!success) {
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 })
  }

  // Get event type for points
  const supabase = await createServerSupabaseClient()
  const { data: event } = await supabase
    .from('events')
    .select('type, title')
    .eq('id', eventId)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const eventRow = event as { type: import('@/lib/supabase').EventType; title: string }

  // Award points, update streak, check badges
  const pointsAwarded = await awardAttendancePoints(session.user.id, eventRow.type)
  await awardFirstCheckin(session.user.id)
  await recalculateStreak(session.user.id)
  const newBadges = await checkAndAwardBadges(session.user.id)

  // Slack DM
  if (session.user.email) {
    await sendCheckinDM(session.user.email, eventRow.title, pointsAwarded)
  }

  return NextResponse.json({
    success: true,
    eventTitle: eventRow.title,
    pointsAwarded,
    newBadges,
  })
}
