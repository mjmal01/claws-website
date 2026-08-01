import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type SubteamSlug =
  | 'ar' | 'ai' | 'infrastructure' | 'ux' | 'hardware'
  | 'research' | 'outreach' | 'content' | 'social'

export type MemberRole   = 'member' | 'leadership' | 'faculty' | 'alumni'
export type MemberStatus = 'active' | 'at_risk' | 'review' | 'inactive'
export type EventType    = 'all_hands' | 'subteam' | 'outreach' | 'milestone'
export type AttendanceMethod = 'qr' | 'manual'
export type AbsenceStatus    = 'pending' | 'approved' | 'denied'
export type MerchOrderStatus = 'pending' | 'fulfilled'
export type NotificationType =
  | 'task' | 'attendance' | 'badge' | 'announcement'
  | 'absence' | 'streak' | 'warning'
export type FaqPage  = 'about' | 'team' | 'join'
export type MerchLine      = 'flight' | 'collectibles' | 'sweat'
export type MerchOrderType = 'form' | 'free' | 'rolling'

export interface Member {
  id: string
  email: string
  name: string
  role: MemberRole
  subteam: SubteamSlug | null
  active: boolean
  joined: string
  avatar_url: string | null
  bio: string | null
  points: number
  streak: number
  status: MemberStatus
  phone: string | null
}

export interface Subteam {
  slug: SubteamSlug
  name: string
  description: string | null
  lead_id: string | null
  slack_channel: string | null
}

export interface Event {
  id: string
  title: string
  type: EventType
  subteam: SubteamSlug | null
  date: string
  location: string | null
  description: string | null
  agenda: Record<string, unknown> | null
  qr_token: string
  qr_expires: string | null
  created_by: string | null
}

export interface Attendance {
  id: string
  member_id: string
  event_id: string
  checked_in: string
  method: AttendanceMethod
  excused: boolean
  note: string | null
}

export interface AbsenceRequest {
  id: string
  member_id: string
  event_id: string
  reason: string | null
  status: AbsenceStatus
  reviewed_by: string | null
  created_at: string
}

export interface Task {
  id: string
  member_id: string | null
  subteam: SubteamSlug | null
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
  completed_at: string | null
  assigned_by: string
  points_value: number
}

export interface Badge {
  slug: string
  label: string
  description: string | null
  icon: string | null
  points: number
}

export interface MemberBadge {
  id: string
  member_id: string
  badge_slug: string
  earned_at: string
}

export interface DriveLink {
  id: string
  label: string
  url: string
  role_required: MemberRole | null
  subteam: SubteamSlug | null
  category: string | null
  sort_order: number
}

export interface MerchItem {
  id: string
  name: string
  slug: string
  photo_url: string | null
  line: MerchLine
  order_type: MerchOrderType
  opens_at: string
  closes_at: string | null
  sizes: string[] | null
  active: boolean
  google_form_url: string | null
}

export interface MerchOrder {
  id: string
  member_id: string
  item_id: string
  size: string | null
  quantity: number
  notes: string | null
  submitted: string
  status: MerchOrderStatus
}

export interface FlightTagClaim {
  id: string
  member_id: string
  claimed_at: string
  picked_up: boolean
  marked_by: string | null
}

export interface NewsPost {
  id: string
  title: string
  body: string
  image_url: string | null
  author_id: string
  created_at: string
  published: boolean
}

export interface Notification {
  id: string
  member_id: string
  type: NotificationType
  message: string
  read: boolean
  created_at: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  page: FaqPage
  sort_order: number
}

export interface Spotlight {
  id: string
  member_id: string
  reason: string
  created_by: string
  created_at: string
  active: boolean
}

export interface TaskAttachment {
  id: string
  task_id: string
  member_id: string
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  uploaded_at: string
}

export interface NewsPostWithAuthor extends NewsPost {
  author: Pick<Member, 'id' | 'name' | 'avatar_url'>
}

export interface TaskWithAssigner extends Task {
  assigner: Pick<Member, 'id' | 'name'> | null
  attachments: TaskAttachment[]
}

// ─── Clients ─────────────────────────────────────────────────────────────────
// Note: Using untyped clients until `supabase gen types` runs against live DB.
// All query results are cast to our domain interfaces above.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = SupabaseClient<any, any, any>

export function createBrowserSupabaseClient(): AnyClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Service-role client — bypasses RLS. Server-only. Never expose to browser.
export function createAdminSupabaseClient(): AnyClient {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Server client uses the service role key — safe because all callers are
// protected by NextAuth session checks. We use NextAuth (not Supabase Auth)
// so auth.uid() is always null in RLS; service role bypasses that correctly.
export async function createServerSupabaseClient(): Promise<AnyClient> {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ─── Typed Query Helpers ──────────────────────────────────────────────────────

export async function getMemberById(id: string): Promise<Member | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('members').select('*').eq('id', id).single()
  return (data as Member) ?? null
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('members').select('*').eq('email', email).single()
  return (data as Member) ?? null
}

export async function getAllActiveMembers(): Promise<Member[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('members').select('*').eq('active', true).order('name')
  return (data as Member[]) ?? []
}

export async function getSubteams(): Promise<Subteam[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('subteams').select('*').order('name')
  return (data as Subteam[]) ?? []
}

export async function getSubteamBySlug(slug: SubteamSlug): Promise<Subteam | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('subteams').select('*').eq('slug', slug).single()
  return (data as Subteam) ?? null
}

export async function getMemberTasks(memberId: string): Promise<Task[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('tasks').select('*').eq('member_id', memberId).order('due_date', { ascending: true })
  return (data as Task[]) ?? []
}

export async function getMemberAttendance(memberId: string): Promise<Attendance[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('attendance').select('*').eq('member_id', memberId).order('checked_in', { ascending: false })
  return (data as Attendance[]) ?? []
}

export async function getMemberNotifications(memberId: string): Promise<Notification[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('notifications').select('*').eq('member_id', memberId).order('created_at', { ascending: false })
  return (data as Notification[]) ?? []
}

export async function getMemberBadges(memberId: string): Promise<MemberBadge[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('member_badges').select('*').eq('member_id', memberId).order('earned_at', { ascending: false })
  return (data as MemberBadge[]) ?? []
}

export async function getMerchItems(): Promise<MerchItem[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('merch_items').select('*').eq('active', true).order('opens_at')
  return (data as MerchItem[]) ?? []
}

export async function getMemberMerchOrders(memberId: string): Promise<MerchOrder[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('merch_orders').select('*').eq('member_id', memberId).order('submitted', { ascending: false })
  return (data as MerchOrder[]) ?? []
}

export async function getFlightTagClaim(memberId: string): Promise<FlightTagClaim | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('flight_tag_claims').select('*').eq('member_id', memberId).single()
  return (data as FlightTagClaim) ?? null
}

export async function getLatestNewsPosts(limit = 5): Promise<NewsPost[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('news_posts').select('*').eq('published', true).order('created_at', { ascending: false }).limit(limit)
  return (data as NewsPost[]) ?? []
}

export async function getFaqsByPage(page: FaqPage): Promise<Faq[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('faqs').select('*').eq('page', page).order('sort_order')
  return (data as Faq[]) ?? []
}

export async function getActiveSpotlight(): Promise<Spotlight | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('spotlights').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1).single()
  return (data as Spotlight) ?? null
}

export async function getDriveLinks(
  role: MemberRole,
  subteam: SubteamSlug | null
): Promise<DriveLink[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('drive_links').select('*').order('sort_order')
  if (!data) return []

  const roleRank: Record<MemberRole, number> = { member: 1, leadership: 2, faculty: 3, alumni: 0 }
  const userRank = roleRank[role]

  return (data as DriveLink[]).filter((link) => {
    if (link.role_required) {
      if (userRank < roleRank[link.role_required]) return false
    }
    if (link.subteam && link.subteam !== subteam) return false
    return true
  })
}

export async function getNewsPostsWithAuthors(limit = 50): Promise<NewsPostWithAuthor[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('news_posts')
    .select('*, author:members!news_posts_author_id_fkey(id, name, avatar_url)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (!data) return []
  return data.map((row) => ({
    ...(row as NewsPost),
    author: (row as { author: Pick<Member, 'id' | 'name' | 'avatar_url'> }).author,
  }))
}

export async function getMemberTasksWithDetails(memberId: string): Promise<TaskWithAssigner[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('tasks')
    .select(`
      *,
      assigner:members!tasks_assigned_by_fkey(id, name),
      attachments:task_attachments(*)
    `)
    .eq('member_id', memberId)
    .order('due_date', { ascending: true, nullsFirst: false })
  if (!data) return []
  return data.map((row) => ({
    ...(row as Task),
    assigner: (row as { assigner: Pick<Member, 'id' | 'name'> | null }).assigner,
    attachments: ((row as { attachments: TaskAttachment[] }).attachments) ?? [],
  }))
}

export async function getAllTasksForManage(
  role: MemberRole,
  userId: string,
  userSubteam: SubteamSlug | null
): Promise<TaskWithAssigner[]> {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('tasks')
    .select(`
      *,
      assigner:members!tasks_assigned_by_fkey(id, name),
      assignee:members!tasks_member_id_fkey(id, name, subteam),
      attachments:task_attachments(*)
    `)
    .order('due_date', { ascending: true, nullsFirst: false })

  // Subteam leads only see their subteam's tasks
  if (role === 'member' && userSubteam) {
    query = query.eq('subteam', userSubteam)
  }

  const { data } = await query
  if (!data) return []

  return data.map((row) => ({
    ...(row as Task),
    assigner: (row as { assigner: Pick<Member, 'id' | 'name'> | null }).assigner,
    assignee: (row as { assignee: Pick<Member, 'id' | 'name' | 'subteam'> | null }).assignee,
    attachments: ((row as { attachments: TaskAttachment[] }).attachments) ?? [],
  })) as TaskWithAssigner[]
}

export async function getTaskAttachments(taskId: string): Promise<TaskAttachment[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('task_attachments')
    .select('*')
    .eq('task_id', taskId)
    .order('uploaded_at', { ascending: false })
  return (data as TaskAttachment[]) ?? []
}

export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('events').select('*').gte('date', new Date().toISOString()).order('date').limit(limit)
  return (data as Event[]) ?? []
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('events').select('*').eq('id', id).single()
  return (data as Event) ?? null
}

export async function getEventAttendance(eventId: string): Promise<Attendance[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('attendance').select('*').eq('event_id', eventId)
  return (data as Attendance[]) ?? []
}

export async function getAbsenceRequestsForEvent(eventId: string): Promise<AbsenceRequest[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('absence_requests').select('*').eq('event_id', eventId).order('created_at', { ascending: false })
  return (data as AbsenceRequest[]) ?? []
}

// ── Messaging Types ────────────────────────────────────────────────────────

export type ChannelType = 'general' | 'subteam' | 'private'

export interface Channel {
  id: string
  name: string
  slug: string
  description: string | null
  type: ChannelType
  subteam: SubteamSlug | null
  created_at: string
}

export interface ChannelMessage {
  id: string
  channel_id: string
  member_id: string
  body: string
  edited_at: string | null
  created_at: string
}

export interface ChannelMessageWithMember extends ChannelMessage {
  member: Pick<Member, 'id' | 'name' | 'avatar_url'>
}

export interface DmThread {
  id: string
  member_a_id: string
  member_b_id: string
  created_at: string
}

export interface DmMessage {
  id: string
  thread_id: string
  sender_id: string
  body: string
  read_at: string | null
  created_at: string
}

export interface DmThreadWithMember extends DmThread {
  other: Pick<Member, 'id' | 'name' | 'avatar_url'>
  lastMessage: DmMessage | null
}

// ── Messaging Query Helpers ────────────────────────────────────────────────

export async function getChannels(): Promise<Channel[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('channels').select('*').order('type').order('name')
  return (data as Channel[]) ?? []
}

export async function getChannelBySlug(slug: string): Promise<Channel | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('channels').select('*').eq('slug', slug).single()
  return (data as Channel) ?? null
}

export async function getChannelMessages(channelId: string, limit = 50): Promise<ChannelMessageWithMember[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('channel_messages')
    .select('*, member:members!channel_messages_member_id_fkey(id, name, avatar_url)')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (!data) return []
  return data.map((row) => ({
    ...(row as ChannelMessage),
    member: (row as { member: Pick<Member, 'id' | 'name' | 'avatar_url'> }).member,
  })).reverse()
}

export async function getDmThreadsForMember(memberId: string): Promise<DmThreadWithMember[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('dm_threads')
    .select('*, member_a:members!dm_threads_member_a_id_fkey(id, name, avatar_url), member_b:members!dm_threads_member_b_id_fkey(id, name, avatar_url)')
    .or(`member_a_id.eq.${memberId},member_b_id.eq.${memberId}`)
    .order('created_at', { ascending: false })
  if (!data) return []
  return data.map((row) => {
    const isA = (row as { member_a_id: string }).member_a_id === memberId
    const other = isA
      ? (row as { member_b: Pick<Member, 'id' | 'name' | 'avatar_url'> }).member_b
      : (row as { member_a: Pick<Member, 'id' | 'name' | 'avatar_url'> }).member_a
    return {
      id: (row as DmThread).id,
      member_a_id: (row as DmThread).member_a_id,
      member_b_id: (row as DmThread).member_b_id,
      created_at: (row as DmThread).created_at,
      other,
      lastMessage: null,
    }
  })
}

export async function getDmMessages(threadId: string, limit = 50): Promise<DmMessage[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('dm_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return ((data as DmMessage[]) ?? []).reverse()
}

export async function getOrCreateDmThread(memberAId: string, memberBId: string): Promise<string> {
  const supabase = await createServerSupabaseClient()
  // canonical order: smaller id first
  const [a, b] = [memberAId, memberBId].sort()
  const { data: existing } = await supabase
    .from('dm_threads')
    .select('id')
    .eq('member_a_id', a)
    .eq('member_b_id', b)
    .single()
  if (existing) return (existing as { id: string }).id
  const { data: created } = await supabase
    .from('dm_threads')
    .insert({ member_a_id: a, member_b_id: b })
    .select('id')
    .single()
  return (created as { id: string }).id
}
