import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSubteams } from '@/lib/supabase'
import type { MemberRole, SubteamSlug } from '@/lib/supabase'
import HelpClient from './HelpClient'

const SUBTEAM_NAMES: Record<SubteamSlug, string> = {
  ar: 'AR',
  ai: 'AI',
  infrastructure: 'Infrastructure',
  ux: 'UX',
  hardware: 'Hardware',
  research: 'Research',
  outreach: 'Outreach',
  content: 'Content',
  social: 'Social',
}

export default async function HelpPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const role    = session.user.role as MemberRole
  const subteam = session.user.subteam as SubteamSlug | null

  const subteams = await getSubteams()

  const isLead        = subteams.some((s) => s.lead_id === session.user.id)
  const isLeadership  = role === 'leadership'
  const isFaculty     = role === 'faculty'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Help &amp; Resources</h1>
        <p className="mt-1 text-white/50 text-sm">Docs, guides, and Drive links — filtered for your role</p>
      </div>

      <HelpClient
        userRole={role}
        userSubteam={subteam}
        subteamNames={SUBTEAM_NAMES}
        isLead={isLead}
        isLeadership={isLeadership}
        isFaculty={isFaculty}
      />
    </div>
  )
}
