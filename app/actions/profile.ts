'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function updateMemberPhone(phone: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const supabase = await createServerSupabaseClient()
  await supabase.from('members').update({ phone: phone.trim() || null }).eq('id', session.user.id)
  revalidatePath('/members/settings')
  revalidatePath('/members/profile')
}

export async function updateMemberBio(bio: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const supabase = await createServerSupabaseClient()
  await supabase.from('members').update({ bio: bio.trim() || null }).eq('id', session.user.id)
  revalidatePath('/members/settings')
  revalidatePath('/members/profile')
}
