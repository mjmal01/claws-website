'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar } from '@/components/ui/Avatar'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type {
  Channel,
  ChannelMessageWithMember,
  DmThreadWithMember,
  DmMessage,
  Member,
} from '@/lib/supabase'
import {
  sendChannelMessage,
  sendDmMessage,
  deleteChannelMessage,
  startDmThread,
  fetchChannelMessages,
  fetchDmMessages,
} from '@/app/actions/messages'

// ── Subteam accent map ─────────────────────────────────────────────────────

const SUBTEAM_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  ar:             { bg: 'bg-violet-500/15',  text: 'text-violet-400',  border: 'border-violet-500/30',  dot: 'bg-violet-400' },
  ai:             { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'border-cyan-500/30',    dot: 'bg-cyan-400' },
  infrastructure: { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30',  dot: 'bg-orange-400' },
  ux:             { bg: 'bg-pink-500/15',    text: 'text-pink-400',    border: 'border-pink-500/30',    dot: 'bg-pink-400' },
  hardware:       { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  research:       { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  border: 'border-indigo-500/30',  dot: 'bg-indigo-400' },
  outreach:       { bg: 'bg-yellow-500/15',  text: 'text-yellow-400',  border: 'border-yellow-500/30',  dot: 'bg-yellow-400' },
  content:        { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/30',    dot: 'bg-rose-400' },
  social:         { bg: 'bg-sky-500/15',     text: 'text-sky-400',     border: 'border-sky-500/30',     dot: 'bg-sky-400' },
}

// ── Types ──────────────────────────────────────────────────────────────────

type ActiveView =
  | { type: 'channel'; id: string }
  | { type: 'dm'; threadId: string; otherId: string }

interface MessagesClientProps {
  currentUserId: string
  channels: Channel[]
  dmThreads: DmThreadWithMember[]
  allMembers: Member[]
  defaultChannelId: string | null
  initialMessages: ChannelMessageWithMember[]
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDateDivider(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function minutesDiff(a: string, b: string): number {
  return Math.abs(new Date(b).getTime() - new Date(a).getTime()) / 60000
}

// ── Date divider ───────────────────────────────────────────────────────────

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4 px-4">
      <div className="flex-1 border-t border-white/8" />
      <span className="text-xs text-white/30 font-medium flex-shrink-0">{label}</span>
      <div className="flex-1 border-t border-white/8" />
    </div>
  )
}

// ── Channel message row (Discord/Slack style) ──────────────────────────────

interface ChannelMessageRowProps {
  msg: ChannelMessageWithMember
  isGrouped: boolean
  isOwn: boolean
  isLastInGroup: boolean
  channelSubteam: string | null
  onDelete: (id: string) => void
}

function ChannelMessageRow({
  msg,
  isGrouped,
  isOwn,
  isLastInGroup,
  channelSubteam,
  onDelete,
}: ChannelMessageRowProps) {
  const [hovered, setHovered] = useState(false)
  const nameColor = channelSubteam && SUBTEAM_COLORS[channelSubteam]
    ? SUBTEAM_COLORS[channelSubteam].text
    : 'text-white/90'

  return (
    <div
      className={[
        'group relative flex gap-3 px-4 rounded-lg mx-1 transition-colors',
        isGrouped ? 'py-0.5' : 'pt-2 pb-0.5',
        'hover:bg-white/[0.05]',
        isLastInGroup ? 'mb-2' : '',
      ].join(' ')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar / timestamp spacer */}
      <div className="w-9 flex-shrink-0 pt-0.5">
        {!isGrouped ? (
          <Avatar src={msg.member.avatar_url} name={msg.member.name} size="sm" />
        ) : (
          <span className="block text-[10px] text-white/20 text-right leading-5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
            {formatTime(msg.created_at).replace(' ', '')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {!isGrouped && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className={['text-sm font-semibold', nameColor].join(' ')}>{msg.member.name}</span>
            <span className="text-[11px] text-white/30">{formatTime(msg.created_at)}</span>
          </div>
        )}
        <p className="text-sm text-white/80 leading-relaxed break-words">{msg.body}</p>
      </div>

      {/* Delete button (own messages only) */}
      {isOwn && hovered && (
        <button
          onClick={() => onDelete(msg.id)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-red-400/60 hover:text-red-400 transition-colors rounded-lg bg-space/80"
          title="Delete message"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  )
}

// ── DM message bubble (iMessage style) ────────────────────────────────────

interface DmBubbleProps {
  msg: DmMessage
  isOwn: boolean
  isFirstInGroup: boolean
  isLastInGroup: boolean
  senderName: string
  senderAvatar: string | null
  showDelivered: boolean
}

function DmBubble({
  msg,
  isOwn,
  isFirstInGroup,
  isLastInGroup,
  senderName,
  senderAvatar,
  showDelivered,
}: DmBubbleProps) {
  return (
    <div className={['flex gap-2 px-4', isOwn ? 'justify-end' : 'justify-start', isFirstInGroup ? 'mt-3' : 'mt-0.5'].join(' ')}>
      {/* Other's avatar — shown only on first message in group */}
      {!isOwn && (
        <div className="w-8 flex-shrink-0 self-end">
          {isLastInGroup ? (
            <Avatar src={senderAvatar} name={senderName} size="sm" />
          ) : (
            <div className="w-8" />
          )}
        </div>
      )}

      <div className={['flex flex-col', isOwn ? 'items-end' : 'items-start', 'max-w-[75%]'].join(' ')}>
        {/* Sender name — first in group, not own */}
        {!isOwn && isFirstInGroup && (
          <span className="text-xs font-medium text-white/40 mb-1 ml-1">{senderName}</span>
        )}

        {/* Bubble */}
        <div
          className={[
            'px-4 py-2.5 text-sm leading-relaxed break-words',
            isOwn
              ? ['bg-[#2563eb] text-white', isLastInGroup ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-br-md'].join(' ')
              : ['bg-white/10 text-white/90', isLastInGroup ? 'rounded-2xl rounded-bl-sm' : 'rounded-2xl rounded-bl-md'].join(' '),
          ].join(' ')}
        >
          {msg.body}
        </div>

        {/* Time + delivery indicator — below last bubble in group */}
        {isLastInGroup && (
          <div className={['mt-1 flex items-center gap-1.5', isOwn ? 'flex-row-reverse' : ''].join(' ')}>
            <span className="text-[10px] text-white/25">{formatTime(msg.created_at)}</span>
            {isOwn && showDelivered && (
              <span className="text-[10px] text-white/25">Delivered</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sidebar channel item ───────────────────────────────────────────────────

function SidebarChannelItem({
  channel,
  isActive,
  hasUnread,
  currentUserSubteam,
  onClick,
}: {
  channel: Channel
  isActive: boolean
  hasUnread: boolean
  currentUserSubteam: string | null
  onClick: () => void
}) {
  const isSubteam = channel.type === 'subteam'
  const slug = channel.subteam ?? ''
  const accent = isSubteam && slug && SUBTEAM_COLORS[slug] ? SUBTEAM_COLORS[slug] : null
  const isMySubteam = currentUserSubteam && channel.subteam === currentUserSubteam

  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors',
        isActive && accent
          ? [accent.bg, accent.text].join(' ')
          : isActive
          ? 'bg-white/10 text-white'
          : isMySubteam && !isActive
          ? 'text-white/70 hover:bg-white/5'
          : 'text-white/50 hover:text-white/80 hover:bg-white/5',
      ].join(' ')}
    >
      {/* Dot for subteam channels, # for others */}
      {isSubteam && accent ? (
        <span className={['w-2 h-2 rounded-full flex-shrink-0', accent.dot].join(' ')} />
      ) : (
        <span className="text-white/40 font-light text-sm">#</span>
      )}
      <span className="text-sm truncate flex-1">{channel.name}</span>
      {hasUnread && !isActive && (
        <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
      )}
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function MessagesClient({
  currentUserId,
  channels,
  dmThreads: initialDmThreads,
  allMembers,
  defaultChannelId,
  initialMessages,
}: MessagesClientProps) {
  const { data: session } = useSession()

  // Build a members map for realtime lookups
  const membersMap = useRef<Map<string, Pick<Member, 'id' | 'name' | 'avatar_url' | 'subteam'>>>(
    new Map(allMembers.map((m) => [m.id, { id: m.id, name: m.name, avatar_url: m.avatar_url, subteam: m.subteam }]))
  )

  // Unread set — channel ids with pending unread messages
  const [unreadChannels, setUnreadChannels] = useState<Set<string>>(new Set())

  // Current user info
  const currentUser = allMembers.find((m) => m.id === currentUserId)
  const currentUserSubteam = currentUser?.subteam ?? null

  // State
  const [activeView, setActiveView] = useState<ActiveView>(
    defaultChannelId
      ? { type: 'channel', id: defaultChannelId }
      : { type: 'channel', id: channels[0]?.id ?? '' }
  )
  const [channelMessages, setChannelMessages] = useState<ChannelMessageWithMember[]>(initialMessages)
  const [dmMessages, setDmMessages] = useState<DmMessage[]>([])
  const [dmThreads, setDmThreads] = useState<DmThreadWithMember[]>(initialDmThreads)
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showMemberPicker, setShowMemberPicker] = useState(false)
  const [memberPickerQuery, setMemberPickerQuery] = useState('')
  const [subteamChannelsExpanded, setSubteamChannelsExpanded] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Held for the component's whole lifetime — the getter reads this ref so
  // the client keeps working as the session's 1h Supabase token re-mints,
  // without tearing down/recreating realtime subscriptions.
  const tokenRef = useRef(session?.supabaseAccessToken ?? null)
  useEffect(() => { tokenRef.current = session?.supabaseAccessToken ?? null }, [session?.supabaseAccessToken])
  const supabaseRef = useRef(createBrowserSupabaseClient(async () => tokenRef.current))

  // Request browser notification permission once on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [channelMessages, dmMessages, scrollToBottom])

  // Realtime subscription
  useEffect(() => {
    const supabase = supabaseRef.current

    if (activeView.type === 'channel') {
      const channelId = activeView.id
      const sub = supabase
        .channel(`channel_messages:${channelId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'channel_messages',
            filter: `channel_id=eq.${channelId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const row = payload.new as {
              id: string
              channel_id: string
              member_id: string
              body: string
              edited_at: string | null
              created_at: string
            }
            setChannelMessages((prev) => {
              if (prev.some((m) => m.id === row.id)) return prev
              const memberInfo = membersMap.current.get(row.member_id) ?? {
                id: row.member_id,
                name: 'Unknown',
                avatar_url: null,
                subteam: null,
              }
              return [
                ...prev,
                {
                  id: row.id,
                  channel_id: row.channel_id,
                  member_id: row.member_id,
                  body: row.body,
                  edited_at: row.edited_at,
                  created_at: row.created_at,
                  member: memberInfo,
                },
              ]
            })

            // Desktop notification for background channel messages
            if (
              document.hidden &&
              row.member_id !== currentUserId &&
              Notification.permission === 'granted'
            ) {
              const sender = membersMap.current.get(row.member_id)
              const channelName = channels.find((c) => c.id === row.channel_id)?.name ?? 'channel'
              new Notification(`${sender?.name ?? 'Someone'} in #${channelName}`, {
                body: (row.body as string).slice(0, 100),
                icon: '/images/home/CLAWS Logo SVG.png',
                tag: row.id as string,
              })
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'channel_messages',
            filter: `channel_id=eq.${channelId}`,
          },
          (payload: { old: Record<string, unknown> }) => {
            const deleted = payload.old as { id: string }
            setChannelMessages((prev) => prev.filter((m) => m.id !== deleted.id))
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(sub)
      }
    } else {
      const threadId = activeView.threadId
      const sub = supabase
        .channel(`dm_messages:${threadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'dm_messages',
            filter: `thread_id=eq.${threadId}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const row = payload.new as unknown as DmMessage
            setDmMessages((prev) => {
              if (prev.some((m) => m.id === row.id)) return prev
              return [...prev, row]
            })

            // Desktop notification for DMs
            if (
              document.hidden &&
              row.sender_id !== currentUserId &&
              Notification.permission === 'granted'
            ) {
              const sender = membersMap.current.get(row.sender_id)
              new Notification(`DM from ${sender?.name ?? 'Someone'}`, {
                body: row.body.slice(0, 100),
                icon: '/images/home/CLAWS Logo SVG.png',
                tag: row.id,
              })
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(sub)
      }
    }
  }, [activeView, channels, currentUserId])

  // Background realtime for unread dots on other channels
  useEffect(() => {
    const supabase = supabaseRef.current
    const backgroundChannels = channels.filter(
      (c) => !(activeView.type === 'channel' && activeView.id === c.id)
    )
    if (backgroundChannels.length === 0) return

    const subs = backgroundChannels.map((ch) =>
      supabase
        .channel(`bg_channel:${ch.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'channel_messages',
            filter: `channel_id=eq.${ch.id}`,
          },
          (payload: { new: Record<string, unknown> }) => {
            const row = payload.new as { member_id: string; channel_id: string }
            if (row.member_id !== currentUserId) {
              setUnreadChannels((prev) => {
                const next = new Set(prev)
                next.add(row.channel_id as string)
                return next
              })
            }
          }
        )
        .subscribe()
    )

    return () => {
      subs.forEach((s) => supabase.removeChannel(s))
    }
  }, [activeView, channels, currentUserId])

  // Switch channel
  async function switchToChannel(channelId: string) {
    if (activeView.type === 'channel' && activeView.id === channelId) return
    setLoadingMessages(true)
    setActiveView({ type: 'channel', id: channelId })
    setSidebarOpen(false)
    // Clear unread dot
    setUnreadChannels((prev) => {
      const next = new Set(prev)
      next.delete(channelId)
      return next
    })
    try {
      const msgs = await fetchChannelMessages(channelId)
      setChannelMessages(msgs)
    } finally {
      setLoadingMessages(false)
    }
  }

  // Switch to DM
  async function switchToDm(threadId: string, otherId: string) {
    if (activeView.type === 'dm' && activeView.threadId === threadId) return
    setLoadingMessages(true)
    setActiveView({ type: 'dm', threadId, otherId })
    setSidebarOpen(false)
    try {
      const msgs = await fetchDmMessages(threadId)
      setDmMessages(msgs)
    } finally {
      setLoadingMessages(false)
    }
  }

  // Send message
  async function handleSend() {
    const text = inputValue.trim()
    if (!text || sending) return
    setSending(true)
    setInputValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      if (activeView.type === 'channel') {
        const optimisticId = `temp-${Date.now()}`
        const me = membersMap.current.get(currentUserId) ?? {
          id: currentUserId,
          name: 'You',
          avatar_url: null,
          subteam: null,
        }
        setChannelMessages((prev) => [
          ...prev,
          {
            id: optimisticId,
            channel_id: activeView.id,
            member_id: currentUserId,
            body: text,
            edited_at: null,
            created_at: new Date().toISOString(),
            member: me,
          },
        ])
        await sendChannelMessage(activeView.id, text)
        setChannelMessages((prev) => prev.filter((m) => m.id !== optimisticId))
      } else {
        const optimisticId = `temp-${Date.now()}`
        setDmMessages((prev) => [
          ...prev,
          {
            id: optimisticId,
            thread_id: activeView.threadId,
            sender_id: currentUserId,
            body: text,
            read_at: null,
            created_at: new Date().toISOString(),
          },
        ])
        await sendDmMessage(activeView.otherId, text)
        setDmMessages((prev) => prev.filter((m) => m.id !== optimisticId))
      }
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  async function handleDeleteMessage(messageId: string) {
    setChannelMessages((prev) => prev.filter((m) => m.id !== messageId))
    await deleteChannelMessage(messageId)
  }

  async function handleStartDm(memberId: string) {
    setShowMemberPicker(false)
    setMemberPickerQuery('')
    const threadId = await startDmThread(memberId)
    setDmThreads((prev) => {
      if (prev.some((t) => t.id === threadId)) return prev
      const other = membersMap.current.get(memberId) ?? {
        id: memberId,
        name: 'Unknown',
        avatar_url: null,
        subteam: null,
      }
      return [
        {
          id: threadId,
          member_a_id: [currentUserId, memberId].sort()[0],
          member_b_id: [currentUserId, memberId].sort()[1],
          created_at: new Date().toISOString(),
          other,
          lastMessage: null,
        },
        ...prev,
      ]
    })
    setDmMessages([])
    setActiveView({ type: 'dm', threadId, otherId: memberId })
  }

  // Derived
  const generalChannels = channels.filter((c) => c.type === 'general')
  const subteamChannels = channels.filter((c) => c.type === 'subteam')
  const privateChannels = channels.filter((c) => c.type === 'private')

  const activeChannel =
    activeView.type === 'channel' ? channels.find((c) => c.id === activeView.id) : null
  const activeChannelAccent =
    activeChannel?.subteam && SUBTEAM_COLORS[activeChannel.subteam]
      ? SUBTEAM_COLORS[activeChannel.subteam]
      : null

  const activeDmOther =
    activeView.type === 'dm'
      ? (membersMap.current.get(activeView.otherId) ?? { id: activeView.otherId, name: 'Unknown', avatar_url: null, subteam: null })
      : null

  const activeDmMember =
    activeView.type === 'dm'
      ? allMembers.find((m) => m.id === activeView.otherId) ?? null
      : null

  const filteredMembers = allMembers.filter(
    (m) =>
      m.id !== currentUserId &&
      m.name.toLowerCase().includes(memberPickerQuery.toLowerCase())
  )

  // Input placeholder
  const inputPlaceholder =
    activeView.type === 'channel'
      ? `Message #${activeChannel?.name ?? 'channel'}`
      : `Message ${activeDmOther?.name ?? ''}`

  // Focus ring color for input — use subteam accent or nebula blue
  const inputFocusClass = activeChannelAccent ? '' : 'focus-within:border-nebula/50'

  // ── Channel message rendering ────────────────────────────────────────────

  function renderChannelMessages() {
    const rows: React.ReactNode[] = []
    let lastDate = ''
    let lastSenderId = ''
    let lastSentAt = ''

    for (let i = 0; i < channelMessages.length; i++) {
      const msg = channelMessages[i]
      const dateLabel = formatDateDivider(msg.created_at)

      if (dateLabel !== lastDate) {
        rows.push(<DateDivider key={`date-${msg.created_at}`} label={dateLabel} />)
        lastDate = dateLabel
        lastSenderId = ''
        lastSentAt = ''
      }

      const isGrouped =
        msg.member_id === lastSenderId &&
        lastSentAt !== '' &&
        minutesDiff(lastSentAt, msg.created_at) < 5

      const nextMsg = channelMessages[i + 1]
      const isLastInGroup =
        !nextMsg ||
        nextMsg.member_id !== msg.member_id ||
        minutesDiff(msg.created_at, nextMsg.created_at) >= 5

      rows.push(
        <ChannelMessageRow
          key={msg.id}
          msg={msg}
          isGrouped={isGrouped}
          isOwn={msg.member_id === currentUserId}
          isLastInGroup={isLastInGroup}
          channelSubteam={activeChannel?.subteam ?? null}
          onDelete={handleDeleteMessage}
        />
      )

      lastSenderId = msg.member_id
      lastSentAt = msg.created_at
    }

    return rows
  }

  // ── DM message rendering ─────────────────────────────────────────────────

  function renderDmMessages() {
    const rows: React.ReactNode[] = []
    let lastDate = ''

    // Pre-compute groups
    const grouped: Array<{ msg: DmMessage; isFirstInGroup: boolean; isLastInGroup: boolean }> = []
    for (let i = 0; i < dmMessages.length; i++) {
      const msg = dmMessages[i]
      const prev = dmMessages[i - 1]
      const next = dmMessages[i + 1]

      const isFirstInGroup =
        !prev ||
        prev.sender_id !== msg.sender_id ||
        minutesDiff(prev.created_at, msg.created_at) >= 5

      const isLastInGroup =
        !next ||
        next.sender_id !== msg.sender_id ||
        minutesDiff(msg.created_at, next.created_at) >= 5

      grouped.push({ msg, isFirstInGroup, isLastInGroup })
    }

    for (let i = 0; i < grouped.length; i++) {
      const { msg, isFirstInGroup, isLastInGroup } = grouped[i]
      const dateLabel = formatDateDivider(msg.created_at)

      if (dateLabel !== lastDate) {
        rows.push(<DateDivider key={`date-${msg.created_at}`} label={dateLabel} />)
        lastDate = dateLabel
      }

      const isOwn = msg.sender_id === currentUserId
      const senderInfo = membersMap.current.get(msg.sender_id) ?? {
        id: msg.sender_id,
        name: 'Unknown',
        avatar_url: null,
        subteam: null,
      }

      // "Delivered" shows under the last own message in the whole conversation
      const isVeryLast = i === grouped.length - 1

      rows.push(
        <DmBubble
          key={msg.id}
          msg={msg}
          isOwn={isOwn}
          isFirstInGroup={isFirstInGroup}
          isLastInGroup={isLastInGroup}
          senderName={senderInfo.name}
          senderAvatar={senderInfo.avatar_url}
          showDelivered={isOwn && isVeryLast}
        />
      )
    }

    return rows
  }

  // ── Channel member count (approximation from allMembers) ─────────────────

  function getChannelMemberCount(channel: Channel): number {
    if (channel.type === 'general') return allMembers.length
    if (channel.subteam) {
      return allMembers.filter((m) => m.subteam === channel.subteam).length
    }
    return 0
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={[
          'flex-shrink-0 w-64 flex flex-col bg-white/[0.02] border-r border-white/10 overflow-y-auto',
          'fixed inset-y-0 top-16 z-30 transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">CLAWS Messages</h2>
        </div>

        {/* General channels */}
        <div className="px-2 py-3">
          <p className="px-2 mb-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
            Channels
          </p>

          {generalChannels.map((ch) => (
            <SidebarChannelItem
              key={ch.id}
              channel={ch}
              isActive={activeView.type === 'channel' && activeView.id === ch.id}
              hasUnread={unreadChannels.has(ch.id)}
              currentUserSubteam={currentUserSubteam}
              onClick={() => switchToChannel(ch.id)}
            />
          ))}

          {privateChannels.map((ch) => (
            <SidebarChannelItem
              key={ch.id}
              channel={ch}
              isActive={activeView.type === 'channel' && activeView.id === ch.id}
              hasUnread={unreadChannels.has(ch.id)}
              currentUserSubteam={currentUserSubteam}
              onClick={() => switchToChannel(ch.id)}
            />
          ))}

          {/* Subteam channels — expanded by default */}
          {subteamChannels.length > 0 && (
            <>
              <button
                className="w-full flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider hover:text-white/50 transition-colors mt-2"
                onClick={() => setSubteamChannelsExpanded((v) => !v)}
              >
                <svg
                  className={['w-3 h-3 transition-transform', subteamChannelsExpanded ? 'rotate-90' : ''].join(' ')}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Subteams
              </button>
              {subteamChannelsExpanded &&
                subteamChannels.map((ch) => (
                  <SidebarChannelItem
                    key={ch.id}
                    channel={ch}
                    isActive={activeView.type === 'channel' && activeView.id === ch.id}
                    hasUnread={unreadChannels.has(ch.id)}
                    currentUserSubteam={currentUserSubteam}
                    onClick={() => switchToChannel(ch.id)}
                  />
                ))}
            </>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-white/10" />

        {/* Direct Messages */}
        <div className="px-2 py-3 flex-1">
          <div className="flex items-center justify-between px-2 mb-1">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">
              Direct Messages
            </p>
            <button
              onClick={() => setShowMemberPicker(true)}
              className="p-0.5 text-white/30 hover:text-white/70 transition-colors rounded"
              title="New DM"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {dmThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => switchToDm(thread.id, thread.other.id)}
              className={[
                'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors',
                activeView.type === 'dm' && activeView.threadId === thread.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5',
              ].join(' ')}
            >
              <Avatar src={thread.other.avatar_url} name={thread.other.name} size="xs" />
              <span className="text-sm truncate">{thread.other.name}</span>
            </button>
          ))}

          {dmThreads.length === 0 && (
            <p className="px-2 text-xs text-white/25 mt-1">No conversations yet</p>
          )}
        </div>

        {/* Sidebar footer — current user */}
        {currentUser && (
          <div className="px-3 py-3 border-t border-white/10 flex items-center gap-2.5">
            <div className="relative">
              <Avatar src={currentUser.avatar_url} name={currentUser.name} size="xs" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-space" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-green-400">Online</p>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Chat Area ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat header */}
        <div
          className={[
            'flex-shrink-0 flex items-center gap-3 px-4 h-14 border-b border-white/10 bg-white/[0.01]',
            activeChannelAccent ? `border-l-2 ${activeChannelAccent.border}` : '',
          ].join(' ')}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 text-white/50 hover:text-white transition-colors rounded"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {activeView.type === 'channel' && activeChannel && (
            <>
              {activeChannel.subteam && activeChannelAccent ? (
                <span className={['w-3 h-3 rounded-full flex-shrink-0', activeChannelAccent.dot].join(' ')} />
              ) : (
                <span className="text-white/40 font-light">#</span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={['text-sm font-semibold', activeChannelAccent ? activeChannelAccent.text : 'text-white'].join(' ')}>
                    {activeChannel.name}
                  </p>
                  {activeChannel.subteam && (
                    <span className={[
                      'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                      activeChannelAccent ? [activeChannelAccent.bg, activeChannelAccent.text, activeChannelAccent.border].join(' ') : 'bg-white/10 text-white/50 border-white/10',
                    ].join(' ')}>
                      {getChannelMemberCount(activeChannel)} members
                    </span>
                  )}
                </div>
                {activeChannel.description && (
                  <p className="text-xs text-white/40 leading-none truncate">{activeChannel.description}</p>
                )}
              </div>
            </>
          )}

          {activeView.type === 'dm' && activeDmOther && (
            <>
              <Avatar src={activeDmOther.avatar_url} name={activeDmOther.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-white">{activeDmOther.name}</p>
                  {activeDmOther.subteam && SUBTEAM_COLORS[activeDmOther.subteam] && (
                    <span className={[
                      'px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize',
                      SUBTEAM_COLORS[activeDmOther.subteam].bg,
                      SUBTEAM_COLORS[activeDmOther.subteam].text,
                      SUBTEAM_COLORS[activeDmOther.subteam].border,
                    ].join(' ')}>
                      {activeDmOther.subteam}
                    </span>
                  )}
                  {activeDmMember?.phone && (
                    <span className="text-xs text-white/35">📱 {activeDmMember.phone}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-4 scroll-smooth">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : activeView.type === 'channel' ? (
            <>
              {channelMessages.length === 0 && activeChannel && (
                <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-3">
                  <div className={[
                    'w-16 h-16 rounded-full flex items-center justify-center text-2xl',
                    activeChannelAccent ? activeChannelAccent.bg : 'bg-white/5',
                  ].join(' ')}>
                    {activeChannel.subteam ? '🛸' : '#'}
                  </div>
                  <div>
                    <p className={['text-lg font-bold mb-1', activeChannelAccent ? activeChannelAccent.text : 'text-white'].join(' ')}>
                      #{activeChannel.name}
                    </p>
                    <p className="text-white/40 text-sm">
                      {activeChannel.subteam
                        ? `This is the beginning of #${activeChannel.name} — the ${activeChannel.name} subteam channel`
                        : `This is the beginning of #${activeChannel.name} — the main CLAWS channel`}
                    </p>
                  </div>
                </div>
              )}
              {renderChannelMessages()}
            </>
          ) : (
            <>
              {dmMessages.length === 0 && activeDmOther && (
                <div className="flex flex-col items-center justify-center h-full text-center px-8 gap-3">
                  <Avatar src={activeDmOther.avatar_url} name={activeDmOther.name} size="xl" />
                  <div>
                    <p className="text-lg font-bold text-white mb-0.5">{activeDmOther.name}</p>
                    {activeDmOther.subteam && SUBTEAM_COLORS[activeDmOther.subteam] && (
                      <span className={[
                        'inline-block px-3 py-0.5 rounded-full text-xs font-semibold capitalize border mb-2',
                        SUBTEAM_COLORS[activeDmOther.subteam].bg,
                        SUBTEAM_COLORS[activeDmOther.subteam].text,
                        SUBTEAM_COLORS[activeDmOther.subteam].border,
                      ].join(' ')}>
                        {activeDmOther.subteam}
                      </span>
                    )}
                    <p className="text-white/40 text-sm">
                      Start a conversation with <strong className="text-white/60">{activeDmOther.name}</strong>
                    </p>
                  </div>
                </div>
              )}
              {renderDmMessages()}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <div className={[
            'flex items-end gap-3 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 transition-colors',
            inputFocusClass,
          ].join(' ')}>
            {/* Current user avatar */}
            {currentUser && (
              <div className="flex-shrink-0 pb-0.5">
                <Avatar src={currentUser.avatar_url} name={currentUser.name} size="xs" />
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={inputPlaceholder}
              rows={1}
              className="flex-1 bg-transparent resize-none text-sm text-white placeholder-white/30 focus:outline-none leading-relaxed"
              style={{ maxHeight: '120px' }}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || sending}
              className={[
                'flex-shrink-0 p-1.5 rounded-lg transition-all mb-0.5',
                inputValue.trim()
                  ? 'bg-maize text-space hover:bg-maize-light'
                  : 'bg-transparent text-white/20 cursor-not-allowed',
              ].join(' ')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-white/20 px-1">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </main>

      {/* ── Member Picker Modal ───────────────────────────────────────────── */}
      {showMemberPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => { setShowMemberPicker(false); setMemberPickerQuery('') }}
          />
          <div className="relative w-full max-w-sm bg-space-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">New Direct Message</h3>
            </div>
            <div className="px-4 py-3 border-b border-white/10">
              <input
                autoFocus
                type="text"
                value={memberPickerQuery}
                onChange={(e) => setMemberPickerQuery(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-nebula/50"
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <p className="px-5 py-4 text-sm text-white/40">No members found</p>
              ) : (
                filteredMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleStartDm(m.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <Avatar src={m.avatar_url} name={m.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-white">{m.name}</p>
                      {m.subteam && SUBTEAM_COLORS[m.subteam] && (
                        <p className={['text-xs capitalize', SUBTEAM_COLORS[m.subteam].text].join(' ')}>
                          {m.subteam}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => { setShowMemberPicker(false); setMemberPickerQuery('') }}
                className="px-4 py-1.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
