import Link from 'next/link'
import { SubteamCard } from '@/components/public/SubteamCard'

const subteams = [
  { icon: '🚀', name: 'Software', description: 'Flight software, autonomy & embedded systems', memberCount: 18, href: '/team/subteam-leads' },
  { icon: '⚙️', name: 'Hardware', description: 'Mechanical design, fabrication & robotics', memberCount: 16, href: '/team/subteam-leads' },
  { icon: '🔬', name: 'Science', description: 'Mission science & instrument integration', memberCount: 10, href: '/team/subteam-leads' },
  { icon: '📡', name: 'Systems', description: 'Systems engineering & integration', memberCount: 8, href: '/team/subteam-leads' },
  { icon: '🛡️', name: 'Safety', description: 'Safety protocols & risk analysis', memberCount: 6, href: '/team/subteam-leads' },
  { icon: '📣', name: 'Outreach', description: 'Community education & recruitment', memberCount: 8, href: '/team/subteam-leads' },
  { icon: '💰', name: 'Finance', description: 'Budget management & fundraising', memberCount: 5, href: '/team/subteam-leads' },
  { icon: '🤝', name: 'Partnerships', description: 'Corporate relations & sponsorships', memberCount: 5, href: '/team/subteam-leads' },
  { icon: '📋', name: 'Project Management', description: 'Planning, scheduling & coordination', memberCount: 6, href: '/team/subteam-leads' },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white-90">Team</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">The People</p>
            <h1 className="text-display-xl text-white mb-6">The People Behind CLAWS</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              80+ passionate students, 9 subteams, one mission. Meet the engineers, scientists, and innovators who make CLAWS possible.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Highlight */}
      <section className="py-16 bg-surface border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-sm text-white-90 mb-10">Leadership</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PM Card */}
            <Link href="/team/pm" className="group block">
              <div className="bg-surface-raised rounded-2xl border border-surface-border p-8 shadow-card hover:shadow-card-hover hover:border-surface-muted transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-maize/30 to-nebula-dark flex items-center justify-center text-3xl flex-shrink-0">
                    📋
                  </div>
                  <div className="flex-1">
                    <div className="text-maize text-xs font-semibold uppercase tracking-widest mb-1">Project Manager</div>
                    <h3 className="text-white-90 font-semibold text-xl mb-1 group-hover:text-white transition-colors">
                      Alex Johnson
                    </h3>
                    <p className="text-white-50 text-sm mb-3">Aerospace Engineering, Class of 2026</p>
                    <p className="text-white-70 text-sm leading-relaxed">
                      Leading CLAWS through its most ambitious season yet — competing in both NASA SUITS and RASC-AL simultaneously while growing the team to 80+ members.
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-nebula text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span>Read full bio</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Exec Board Blurb */}
            <Link href="/team/board" className="group block">
              <div className="bg-surface-raised rounded-2xl border border-surface-border p-8 shadow-card hover:shadow-card-hover hover:border-surface-muted transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nebula-dark to-maize/20 flex items-center justify-center text-3xl flex-shrink-0">
                    ⭐
                  </div>
                  <div className="flex-1">
                    <div className="text-nebula text-xs font-semibold uppercase tracking-widest mb-1">Executive Board</div>
                    <h3 className="text-white-90 font-semibold text-xl mb-1 group-hover:text-white transition-colors">
                      Exec Board
                    </h3>
                    <p className="text-white-50 text-sm mb-3">6 members · President, VPs & Faculty Advisor</p>
                    <p className="text-white-70 text-sm leading-relaxed">
                      Our exec board sets organizational direction, manages partnerships, and ensures CLAWS operates effectively across all 9 subteams throughout the year.
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-nebula text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span>Meet the board</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Subteams Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-display-md text-white-90 mb-2">Our Subteams</h2>
              <p className="text-white-50">Every subteam is led by an experienced student lead.</p>
            </div>
            <Link href="/team/subteam-leads" className="hidden sm:inline-flex items-center gap-2 text-nebula text-sm font-medium hover:text-nebula-light transition-colors">
              Meet the leads
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subteams.map((team) => (
              <SubteamCard key={team.name} {...team} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-sm text-white-90 mb-4">Want to Be on This Page?</h2>
          <p className="text-white-50 mb-8 max-w-xl mx-auto">
            Applications open each semester. Join 80+ students building the future of space exploration.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-8 py-4 rounded-xl hover:bg-maize-light transition-colors duration-200"
          >
            Join CLAWS
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
