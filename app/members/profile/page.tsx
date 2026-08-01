import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getMemberById, getMemberTasksWithDetails } from '@/lib/supabase'
import { Avatar } from '@/components/ui/Avatar'

const SUBTEAM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ar:             { bg: 'bg-violet-500/15',  text: 'text-violet-400',  border: 'border-violet-500/30' },
  ai:             { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'border-cyan-500/30' },
  infrastructure: { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30' },
  ux:             { bg: 'bg-pink-500/15',    text: 'text-pink-400',    border: 'border-pink-500/30' },
  hardware:       { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  research:       { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  border: 'border-indigo-500/30' },
  outreach:       { bg: 'bg-yellow-500/15',  text: 'text-yellow-400',  border: 'border-yellow-500/30' },
  content:        { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/30' },
  social:         { bg: 'bg-sky-500/15',     text: 'text-sky-400',     border: 'border-sky-500/30' },
}

const STATUS_CONFIG = {
  active:   { dot: 'bg-green-400',  label: 'Active' },
  at_risk:  { dot: 'bg-yellow-400', label: 'At Risk' },
  review:   { dot: 'bg-red-400',    label: 'Review' },
  inactive: { dot: 'bg-white/30',   label: 'Inactive' },
}

function formatJoinDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Build a 14×7 activity grid (98 cells, current semester placeholder)
function ContributionGrid() {
  const weeks = Array.from({ length: 14 })
  const days = Array.from({ length: 7 })

  // Month labels — rough mapping: col 0 = ~Jan, etc.
  const monthLabels = ['Jan', '', 'Feb', '', 'Mar', '', 'Apr', '', 'May', '', 'Jun', '', 'Jul', '']

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/8 p-6">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Contribution Activity</h3>
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex gap-1 mb-1 pl-0">
            {monthLabels.map((label, i) => (
              <div key={i} className="w-3 text-[9px] text-white/25 text-center leading-none">
                {label}
              </div>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((_, w) => (
              <div key={w} className="flex flex-col gap-1">
                {days.map((_, d) => (
                  <div key={d} className="w-3 h-3 rounded-sm bg-white/5" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/25 italic">Contribution activity coming soon</p>
    </div>
  )
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/signin')

  const [member, tasksWithDetails] = await Promise.all([
    getMemberById(session.user.id),
    getMemberTasksWithDetails(session.user.id),
  ])

  if (!member) redirect('/auth/signin')

  const completedTasks = tasksWithDetails.filter((t) => t.completed)
  const totalTaskPoints = tasksWithDetails
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.points_value, 0)

  const subteamColors = member.subteam ? SUBTEAM_COLORS[member.subteam] : null
  const statusConfig = STATUS_CONFIG[member.status]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

      {/* Header card */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-8 flex flex-col items-center text-center">
        <Avatar src={member.avatar_url} name={member.name} size="xl" className="mb-4" />

        <h1 className="text-2xl font-bold text-white mb-2">{member.name}</h1>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {member.subteam && subteamColors && (
            <span className={['px-3 py-1 rounded-full text-xs font-semibold capitalize border', subteamColors.bg, subteamColors.text, subteamColors.border].join(' ')}>
              {member.subteam}
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/60 capitalize border border-white/10">
            {member.role}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-[#FFCB05]">{member.points}</span>
            <span className="text-xs text-white/40 mt-0.5">Points</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white">{member.streak} 🔥</span>
            <span className="text-xs text-white/40 mt-0.5">Streak</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <div className={['w-2 h-2 rounded-full', statusConfig.dot].join(' ')} />
              <span className="text-sm font-semibold text-white">{statusConfig.label}</span>
            </div>
            <span className="text-xs text-white/40 mt-0.5">Status</span>
          </div>
        </div>

        <Link
          href="/members/settings"
          className="mt-6 px-5 py-2 rounded-lg bg-white/8 text-sm text-white/70 hover:bg-white/12 hover:text-white transition-colors border border-white/10"
        >
          Edit Profile
        </Link>
      </div>

      {/* Info card */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Info</h2>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3">
            <span className="text-white/30 text-sm w-16 flex-shrink-0">Email</span>
            <span className="text-sm text-white/80 break-all">{member.email}</span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-white/30 text-sm w-16 flex-shrink-0">Phone</span>
            {member.phone ? (
              <span className="text-sm text-white/80">{member.phone}</span>
            ) : (
              <span className="text-sm text-white/30 italic">
                No phone added —{' '}
                <Link href="/members/settings" className="text-nebula hover:underline">
                  add in Settings
                </Link>
              </span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <span className="text-white/30 text-sm w-16 flex-shrink-0">Joined</span>
            <span className="text-sm text-white/80">{formatJoinDate(member.joined)}</span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-white/30 text-sm w-16 flex-shrink-0">Bio</span>
            {member.bio ? (
              <p className="text-sm text-white/80 leading-relaxed">{member.bio}</p>
            ) : (
              <p className="text-sm text-white/30 italic">No bio yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 text-center">
          <div className="text-2xl font-bold text-[#FFCB05]">{completedTasks.length}</div>
          <div className="text-xs text-white/40 mt-1">Tasks Completed</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 text-center">
          <div className="text-2xl font-bold text-[#FFCB05]">{totalTaskPoints}</div>
          <div className="text-xs text-white/40 mt-1">Points Earned</div>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4 text-center">
          <div className="text-2xl font-bold text-white">{member.streak}</div>
          <div className="text-xs text-white/40 mt-1">Week Streak</div>
        </div>
      </div>

      {/* Contribution grid */}
      <ContributionGrid />
    </div>
  )
}
