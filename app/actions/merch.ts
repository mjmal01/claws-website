'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function claimFlightTag(): Promise<{ ok: boolean; error?: string }> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { ok: false, error: 'Not authenticated' }

  const supabase = await createServerSupabaseClient()

  // Check if already claimed
  const { data: existing } = await supabase
    .from('flight_tag_claims')
    .select('id')
    .eq('member_id', session.user.id)
    .maybeSingle()

  if (existing) return { ok: false, error: 'Already claimed' }

  const { error } = await supabase.from('flight_tag_claims').insert({
    member_id: session.user.id,
    picked_up: false,
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/members/merch')
  return { ok: true }
}
