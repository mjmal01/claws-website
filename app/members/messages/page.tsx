import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getChannels,
  getChannelMessages,
  getDmThreadsForMember,
  getAllActiveMembers,
} from '@/lib/supabase'
import { MessagesClient } from './MessagesClient'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [channels, dmThreads, allMembers] = await Promise.all([
    getChannels(),
    getDmThreadsForMember(session.user.id),
    getAllActiveMembers(),
  ])

  // Load messages for #general by default
  const defaultChannel = channels.find((c) => c.slug === 'general') ?? channels[0]
  const initialMessages = defaultChannel
    ? await getChannelMessages(defaultChannel.id, 50)
    : []

  return (
    <MessagesClient
      currentUserId={session.user.id}
      channels={channels}
      dmThreads={dmThreads}
      allMembers={allMembers}
      defaultChannelId={defaultChannel?.id ?? null}
      initialMessages={initialMessages}
    />
  )
}
