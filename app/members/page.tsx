import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getMemberById,
  getMemberTasksWithDetails,
  getMemberAttendance,
  getLatestNewsPosts,
  getUpcomingEvents,
  getActiveSpotlight,
  getDriveLinks,
  getMemberById as getSpotlightMember,
  getSubteams,
} from '@/lib/supabase'
import type { MemberRole, SubteamSlug, MemberStatus } from '@/lib/supabase'
import Link from 'next/link'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusConfig(status: MemberStatus) {
  switch (status) {
    case 'active':   return { dot: 'bg-status-active',   label: 'Active',   text: 'text-status-active' }
    case 'at_risk':  return { dot: 'bg-status-at_risk',  label: 'At Risk',  text: 'text-status-at_risk' }
    case 'review':   return { dot: 'bg-status-review',   label: 'Review',   text: 'text-status-review' }
    case 'inactive': return { dot: 'bg-status-inactive', label: 'Inactive', text: 'text-status-inactive' }
  }
}

function eventTypeLabel(type: string) {
  switch (type) {
    case 'all_hands':  return 'All-Hands'
    case 'subteam':    return 'Subteam'
    case 'outreach':   return 'Outreach'
    case 'milestone':  return 'Milestone'
    default:           return type
  }
}

function formatEventDate(iso: string) {
  const d = new Date(iso)
  return {
    day:   d.toLocaleDateString('en-US', { weekday: 'short' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    date:  d.getDate(),
    time:  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

function daysUntil(target: Date, from: Date = new Date()): number {
  return Math.max(0, Math.ceil((target.getTime() - from.getTime()) / 86400000))
}

const SUBTEAM_NAMES: Record<SubteamSlug, string> = {
  ar: 'AR', ai: 'AI', infrastructure: 'Infrastructure', ux: 'UX',
  hardware: 'Hardware', research: 'Research', outreach: 'Outreach',
  content: 'Content', social: 'Social',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const userId  = session.user.id
  const role    = session.user.role as MemberRole
  const subteam = session.user.subteam as SubteamSlug | null

  const [member, tasks, attendance, newsPosts, events, spotlight, driveLinks, subteams] =
    await Promise.all([
      getMemberById(userId),
      getMemberTasksWithDetails(userId),
      getMemberAttendance(userId),
      getLatestNewsPosts(3),
      getUpcomingEvents(3),
      getActiveSpotlight(),
      getDriveLinks(role, subteam),
      getSubteams(),
    ])

  if (!member) return null

  const now = new Date()

  // Tasks widgets
  const weekOut = new Date(now)
  weekOut.setDate(weekOut.getDate() + 7)
  const dueSoon  = tasks.filter((t) => !t.completed && t.due_date && new Date(t.due_date) <= weekOut && new Date(t.due_date) >= now)
  const overdue  = tasks.filter((t) => !t.completed && t.due_date && new Date(t.due_date) < now)

  // Attendance widget
  const totalEvents     = await (async () => {
    const { createServerSupabaseClient } = await import('@/lib/supabase')
    const sb = await createServerSupabaseClient()
    const { count } = await sb.from('events').select('id', { count: 'exact', head: true })
    return count ?? 0
  })()
  const attendedCount = attendance.length

  // NASA countdowns
  const suitsDate  = new Date('2026-06-09T08:00:00')
  const rascalDate = new Date('2026-06-09T08:00:00')
  const suitsDays  = daysUntil(suitsDate, now)
  const rascalDays = daysUntil(rascalDate, now)

  // Spotlight member name
  let spotlightMemberName: string | null = null
  if (spotlight?.member_id) {
    const sm = await getSpotlightMember(spotlight.member_id)
    spotlightMemberName = sm?.name ?? null
  }

  // Drive links — up to 6
  const quickLinks = driveLinks.slice(0, 6)

  // Subteam name
  const subteamName = subteam ? (SUBTEAM_NAMES[subteam] ?? subteam) : null

  // Is subteam lead
  const isLead = subteams.some((s) => s.lead_id === userId)

  const statusCfg = statusConfig(member.status)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ── Section 1: Profile Card ─────────────────────────────────────────── */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-card overflow-hidden shadow-card p-6">
        {/* Subtle nebula glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-hero opacity-40" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

          {/* Avatar */}
          <div className="flex-shrink-0">
            {member.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatar_url}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-nebula-muted border border-nebula/30 flex items-center justify-center ring-2 ring-white/10">
                <span className="text-nebula font-bold text-xl">
                  {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white tracking-tight truncate">{member.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {subteamName && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-maize-muted border border-maize/20 text-maize text-xs font-semibold uppercase tracking-wide">
                  {subteamName}
                </span>
              )}
              {isLead && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-nebula-muted border border-nebula/20 text-nebula-light text-xs font-semibold uppercase tracking-wide">
                  Lead
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-semibold uppercase tracking-wide">
                {member.role}
              </span>
            </div>
          </div>

          {/* Right: points + streak + status */}
          <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-3">
            <div className="text-right">
              <p className="text-3xl font-bold text-maize leading-none">{member.points.toLocaleString()}</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Points</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white leading-none">🔥 {member.streak}</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Week Streak</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
              <span className={`text-xs font-semibold ${statusCfg.text}`}>{statusCfg.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: NASA Countdown ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'NASA SUITS 2026', days: suitsDays, emoji: '🚀', location: 'JSC Houston' },
          { label: 'NASA RASC-AL 2026', days: rascalDays, emoji: '🛰️', location: 'Cocoa Beach, FL' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-5 flex items-center gap-5"
          >
            <span className="text-3xl">{item.emoji}</span>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">{item.label}</p>
              <p className="text-4xl font-bold text-maize leading-none mt-1">{item.days}</p>
              <p className="text-xs text-white/50 mt-1">days remaining · {item.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 3: Three Widgets ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Tasks widget */}
        <div className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-5 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Tasks</p>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white">{dueSoon.length}</p>
            <p className="text-xs text-white/50 mt-0.5">due this week</p>
            {overdue.length > 0 && (
              <p className="text-xs text-red-400 mt-1.5 font-medium">{overdue.length} overdue</p>
            )}
          </div>
          <Link href="/members/tasks" className="text-xs text-nebula-light hover:text-nebula transition-colors">
            View all tasks →
          </Link>
        </div>

        {/* Attendance widget */}
        <div className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-5 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Attendance</p>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white">{attendedCount} <span className="text-sm text-white/40 font-normal">/ {totalEvents}</span></p>
            <p className="text-xs text-white/50 mt-0.5">meetings attended</p>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-maize transition-all"
                style={{ width: totalEvents > 0 ? `${Math.round((attendedCount / totalEvents) * 100)}%` : '0%' }}
              />
            </div>
            <p className="text-xs text-white/30 mt-1">
              {totalEvents > 0 ? Math.round((attendedCount / totalEvents) * 100) : 0}% attendance rate
            </p>
          </div>
          <Link href="/members/manage/attendance" className="text-xs text-nebula-light hover:text-nebula transition-colors">
            View details →
          </Link>
        </div>

        {/* Spotlight widget */}
        <div className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-5 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Member Spotlight</p>
          <div className="flex-1">
            {spotlight && spotlightMemberName ? (
              <>
                <p className="text-base font-semibold text-white leading-snug">⭐ {spotlightMemberName}</p>
                <p className="text-xs text-white/50 mt-1.5 leading-relaxed line-clamp-3">{spotlight.reason}</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                <span className="text-2xl mb-1">⭐</span>
                <p className="text-xs text-white/30">No spotlight this week</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 4: Latest News ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-widest text-white/40 font-semibold">Latest News</h2>
          <Link href="/members/news" className="text-xs text-nebula-light hover:text-nebula transition-colors">View all →</Link>
        </div>
        {newsPosts.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center">
            <span className="text-2xl mb-2 block">📢</span>
            <p className="text-sm text-white/30">No announcements yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {newsPosts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-5 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-snug">{post.title}</h3>
                    <p className="text-xs text-white/50 mt-1.5 line-clamp-2 leading-relaxed">{post.body}</p>
                  </div>
                  <time className="text-xs text-white/30 flex-shrink-0 pt-0.5">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 5: Upcoming Events ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-widest text-white/40 font-semibold">Upcoming Events</h2>
        </div>
        {events.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center">
            <span className="text-2xl mb-2 block">📅</span>
            <p className="text-sm text-white/30">No upcoming events scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const dt = formatEventDate(event.date)
              return (
                <div key={event.id} className="rounded-2xl border border-white/10 bg-gradient-card shadow-card p-4 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Date badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                      <span className="text-maize text-xs font-semibold uppercase">{dt.month}</span>
                      <span className="text-white font-bold text-lg leading-none">{dt.date}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white text-sm truncate">{event.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-white/40 uppercase tracking-wide flex-shrink-0">
                          {eventTypeLabel(event.type)}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">{dt.day} · {dt.time}{event.location ? ` · ${event.location}` : ''}</p>
                    </div>
                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <Link
                        href="/members/manage/attendance"
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80 transition-colors"
                      >
                        Request Absence
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Section 6: Subteam Activity Feed ───────────────────────────────── */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">Subteam Activity</h2>
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl">🛸</span>
          <p className="text-sm text-white/30 leading-relaxed max-w-xs">
            Activity feed coming soon — check back after your first meeting
          </p>
        </div>
      </div>

      {/* ── Section 7: Drive Quick Links ────────────────────────────────────── */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">Quick Links</h2>
        {quickLinks.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-white/30">No links configured yet — ask leadership to add your team&apos;s docs</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all group"
              >
                <span className="text-lg flex-shrink-0">
                  {link.category?.toLowerCase().includes('folder') ? '📁' : '📄'}
                </span>
                <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">{link.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
