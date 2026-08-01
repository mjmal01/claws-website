import Link from 'next/link'

const leads = [
  {
    subteam: 'Software',
    icon: '🚀',
    name: 'Ethan Park',
    major: 'Computer Science',
    year: 'Class of 2025',
    bio: 'Leading the 18-person Software team in building HoloLens AR overlays and autonomous rover control software.',
    gradient: 'from-nebula-dark to-space-800',
  },
  {
    subteam: 'Hardware',
    icon: '⚙️',
    name: 'Sofia Martinez',
    major: 'Mechanical Engineering',
    year: 'Class of 2025',
    bio: 'Overseeing mechanical design, fabrication, and robotics integration for CLAWS competition hardware.',
    gradient: 'from-maize/30 to-space-800',
  },
  {
    subteam: 'Science',
    icon: '🔬',
    name: 'Liam Okonkwo',
    major: 'Earth & Environmental Science',
    year: 'Class of 2026',
    bio: 'Coordinating mission science requirements and integrating science instruments into our competition systems.',
    gradient: 'from-space-700 to-nebula-dark',
  },
  {
    subteam: 'Systems',
    icon: '📡',
    name: 'Mei Zhang',
    major: 'Aerospace Engineering',
    year: 'Class of 2025',
    bio: 'Managing systems engineering processes, requirements traceability, and interface control documents.',
    gradient: 'from-nebula/20 to-space-900',
  },
  {
    subteam: 'Safety',
    icon: '🛡️',
    name: 'Devin Brooks',
    major: 'Nuclear Engineering & Radiological Sciences',
    year: 'Class of 2026',
    bio: 'Developing safety protocols, conducting risk analyses, and ensuring NASA safety compliance across all activities.',
    gradient: 'from-maize/20 to-nebula-dark',
  },
  {
    subteam: 'Outreach',
    icon: '📣',
    name: 'Natasha Gupta',
    major: 'Education & Science, Technology & Society',
    year: 'Class of 2026',
    bio: 'Organizing K-12 outreach events, managing CLAWS social media, and running the annual recruitment campaign.',
    gradient: 'from-space-800 to-nebula-dark',
  },
  {
    subteam: 'Finance',
    icon: '💰',
    name: 'Ryan Thompson',
    major: 'Business Administration',
    year: 'Class of 2026',
    bio: 'Managing the CLAWS annual budget, coordinating grant applications, and handling competition expense reports.',
    gradient: 'from-maize/25 to-space-800',
  },
  {
    subteam: 'Partnerships',
    icon: '🤝',
    name: 'Camille Dubois',
    major: 'Industrial & Operations Engineering',
    year: 'Class of 2025',
    bio: 'Building and maintaining corporate sponsor relationships and negotiating partnership agreements.',
    gradient: 'from-nebula-dark to-maize/15',
  },
  {
    subteam: 'Project Management',
    icon: '📋',
    name: 'Omar Hassan',
    major: 'Electrical Engineering',
    year: 'Class of 2026',
    bio: 'Maintaining the project schedule, tracking deliverables across all subteams, and facilitating cross-team coordination.',
    gradient: 'from-space-700 to-nebula/20',
  },
]

export default function SubteamLeadsPage() {
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
            <span className="text-white-90">Subteam Leads</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Subteam Leadership</p>
            <h1 className="text-display-xl text-white mb-6">Subteam Leads</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Each of CLAWS's 9 subteams is led by an experienced member responsible for technical direction, team morale, and competition delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Leads Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leads.map((lead) => (
              <div
                key={lead.name}
                className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card flex flex-col items-center text-center"
              >
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${lead.gradient} flex items-center justify-center text-2xl mb-4 flex-shrink-0`}>
                  {lead.icon}
                </div>
                <div className="text-maize text-xs font-semibold uppercase tracking-widest mb-1">{lead.subteam} Lead</div>
                <h3 className="text-white-90 font-semibold text-lg mb-1">{lead.name}</h3>
                <p className="text-white-50 text-xs mb-1">{lead.major}</p>
                <p className="text-white-30 text-xs mb-4">{lead.year}</p>
                <p className="text-white-70 text-sm leading-relaxed">{lead.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
