import { createServerSupabaseClient } from './supabase'

export const QR_WINDOW_MINUTES = 15

export function buildCheckinUrl(qrToken: string): string {
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  return `${base}/api/checkin?token=${qrToken}`
}

export async function generateQrToken(
  eventId: string
): Promise<{ token: string; expires: string }> {
  const supabase = await createServerSupabaseClient()
  const expires = new Date(Date.now() + QR_WINDOW_MINUTES * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('events')
    .update({ qr_expires: expires })
    .eq('id', eventId)
    .select('qr_token')
    .single()

  if (error || !data) throw new Error('Failed to generate QR token')

  const row = data as { qr_token: string }
  return { token: row.qr_token, expires }
}

export async function validateQrToken(token: string): Promise<{
  valid: boolean
  eventId: string | null
  reason?: string
}> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('events')
    .select('id, qr_token, qr_expires')
    .eq('qr_token', token)
    .single()

  if (error || !data) return { valid: false, eventId: null, reason: 'Invalid QR code' }

  const event = data as { id: string; qr_token: string; qr_expires: string | null }

  if (!event.qr_expires) return { valid: false, eventId: null, reason: 'QR code has no expiry set' }
  if (new Date(event.qr_expires) < new Date()) return { valid: false, eventId: null, reason: 'QR code has expired' }

  return { valid: true, eventId: event.id }
}

export async function recordCheckin(
  memberId: string,
  eventId: string
): Promise<{ success: boolean; duplicate: boolean }> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from('attendance').insert({
    member_id: memberId,
    event_id: eventId,
    method: 'qr',
  })

  if (error) {
    if (error.code === '23505') return { success: false, duplicate: true }
    return { success: false, duplicate: false }
  }

  return { success: true, duplicate: false }
}
