import Link from 'next/link'

const members = [
  { name: 'Aisha Patel', subteam: 'Software', initials: 'AP', gradient: 'from-nebula-dark to-space-800' },
  { name: 'Ben Carter', subteam: 'Hardware', initials: 'BC', gradient: 'from-maize/30 to-space-800' },
  { name: 'Clara Nguyen', subteam: 'Science', initials: 'CN', gradient: 'from-space-700 to-nebula-dark' },
  { name: 'Dylan Fox', subteam: 'Systems', initials: 'DF', gradient: 'from-nebula/20 to-space-900' },
  { name: 'Eva Morales', subteam: 'Outreach', initials: 'EM', gradient: 'from-maize/20 to-nebula-dark' },
  { name: 'Felix Kim', subteam: 'Software', initials: 'FK', gradient: 'from-space-800 to-nebula-dark' },
  { name: 'Grace Liu', subteam: 'Safety', initials: 'GL', gradient: 'from-maize/25 to-space-800' },
  { name: 'Hiro Tanaka', subteam: 'Hardware', initials: 'HT', gradient: 'from-nebula-dark to-maize/15' },
  { name: 'Imani Johnson', subteam: 'Finance', initials: 'IJ', gradient: 'from-space-700 to-nebula/20' },
  { name: 'Jake Wilson', subteam: 'Partnerships', initials: 'JW', gradient: 'from-nebula-dark to-space-800' },
  { name: 'Kira Osei', subteam: 'Project Management', initials: 'KO', gradient: 'from-maize/20 to-space-800' },
  { name: 'Luis Reyes', subteam: 'Science', initials: 'LR', gradient: 'from-nebula/20 to-nebula-dark' },
]

const subteamColors: Record<string, string> = {
  Software: 'bg-nebula-muted text-nebula border-nebula/30',
  Hardware: 'bg-maize-muted text-maize border-maize/30',
  Science: 'bg-white-10 text-white-70 border-surface-border',
  Systems: 'bg-nebula-muted text-nebula border-nebula/30',
  Safety: 'bg-white-10 text-white-70 border-surface-border',
  Outreach: 'bg-maize-muted text-maize border-maize/30',
  Finance: 'bg-white-10 text-white-70 border-surface-border',
  Partnerships: 'bg-nebula-muted text-nebula border-nebula/30',
  'Project Management': 'bg-maize-muted text-maize border-maize/30',
}

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/team" className="hover:text-white transition-colors">Team</Link>
            <span>/</span>
            <span className="text-white-90">Members</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">The Full Team</p>
            <h1 className="text-display-xl text-white mb-6">Member Directory</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              CLAWS is 80+ strong across 9 subteams. Below is a sample of our talented members — the full directory is available in the member portal.
            </p>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {members.map((member) => (
              <div
                key={member.name}
                className="bg-surface rounded-xl border border-surface-border p-4 shadow-card text-center flex flex-col items-center gap-2"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {member.initials}
                </div>
                <p className="text-white-90 font-medium text-xs leading-tight">{member.name}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${subteamColors[member.subteam] ?? 'bg-white-10 text-white-50 border-surface-border'}`}>
                  {member.subteam}
                </span>
              </div>
            ))}
            {/* Placeholder remaining */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="bg-surface rounded-xl border border-surface-border p-4 shadow-card text-center flex flex-col items-center gap-2 opacity-30"
              >
                <div className="w-12 h-12 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center">
                  <span className="text-white-30 text-xs">?</span>
                </div>
                <p className="text-white-30 text-xs">Member</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white-10 text-white-30 border border-surface-border">
                  CLAWS
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-2xl border border-surface-border p-8 text-center shadow-card">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-white-90 font-semibold text-lg mb-2">Full Directory in the Member Portal</h3>
            <p className="text-white-50 text-sm max-w-lg mx-auto">
              The complete member directory — including contact info, project assignments, and subteam details — is available exclusively to CLAWS members through our internal portal.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
