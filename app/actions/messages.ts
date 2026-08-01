'use server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  createServerSupabaseClient,
  getOrCreateDmThread,
  type ChannelMessage,
  type ChannelMessageWithMember,
  type DmMessage,
  type Member,
} from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function sendChannelMessage(channelId: string, body: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const trimmed = body.trim()
  if (!trimmed || trimmed.length > 4000) throw new Error('Invalid message')
  const supabase = await createServerSupabaseClient()
  await supabase.from('channel_messages').insert({
    channel_id: channelId,
    member_id: session.user.id,
    body: trimmed,
  })
  revalidatePath('/members/messages')
}

export async function sendDmMessage(
  toMemberId: string,
  body: string
): Promise<{ threadId: string }> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const trimmed = body.trim()
  if (!trimmed || trimmed.length > 4000) throw new Error('Invalid message')
  const threadId = await getOrCreateDmThread(session.user.id, toMemberId)
  const supabase = await createServerSupabaseClient()
  await supabase.from('dm_messages').insert({
    thread_id: threadId,
    sender_id: session.user.id,
    body: trimmed,
  })
  return { threadId }
}

export async function deleteChannelMessage(messageId: string): Promise<void> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const supabase = await createServerSupabaseClient()
  await supabase
    .from('channel_messages')
    .delete()
    .eq('id', messageId)
    .eq('member_id', session.user.id)
  revalidatePath('/members/messages')
}

export async function startDmThread(toMemberId: string): Promise<string> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  return getOrCreateDmThread(session.user.id, toMemberId)
}

export async function fetchDmMessages(threadId: string): Promise<DmMessage[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('dm_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: false })
    .limit(50)
  return (((data as DmMessage[]) ?? []).reverse())
}

export async function fetchChannelMessages(channelId: string): Promise<ChannelMessageWithMember[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Unauthorized')
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('channel_messages')
    .select('*, member:members!channel_messages_member_id_fkey(id, name, avatar_url)')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (!data) return []
  return (
    data.map((row) => ({
      ...(row as ChannelMessage),
      member: (row as { member: Pick<Member, 'id' | 'name' | 'avatar_url'> }).member,
    }))
  ).reverse()
}
