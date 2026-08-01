import Link from 'next/link'

const boardMembers = [
  {
    name: 'Sarah Chen',
    title: 'President',
    major: 'Computer Science & Engineering',
    year: 'Class of 2025',
    bio: 'Oversees organizational strategy and serves as the primary liaison between CLAWS and University of Michigan administration.',
    initials: 'SC',
    gradient: 'from-maize/30 to-nebula-dark',
  },
  {
    name: 'Marcus Williams',
    title: 'VP Engineering',
    major: 'Aerospace Engineering',
    year: 'Class of 2025',
    bio: 'Leads technical direction across the Software, Hardware, and Systems subteams, ensuring engineering quality across all competition deliverables.',
    initials: 'MW',
    gradient: 'from-nebula-dark to-maize/20',
  },
  {
    name: 'Priya Patel',
    title: 'VP Operations',
    major: 'Industrial & Operations Engineering',
    year: 'Class of 2026',
    bio: 'Manages internal operations, meeting logistics, member onboarding, and cross-subteam coordination throughout the year.',
    initials: 'PP',
    gradient: 'from-space-700 to-nebula-dark',
  },
  {
    name: 'Jordan Lee',
    title: 'VP Finance',
    major: 'Business Administration',
    year: 'Class of 2026',
    bio: 'Oversees CLAWS budget, manages funding applications, and coordinates financial reporting to university and sponsor stakeholders.',
    initials: 'JL',
    gradient: 'from-maize/20 to-space-800',
  },
  {
    name: 'Aaliyah Robinson',
    title: 'VP Outreach',
    major: 'Science, Technology & Society',
    year: 'Class of 2025',
    bio: 'Leads community engagement, K-12 STEM outreach events, social media presence, and the CLAWS recruiting pipeline.',
    initials: 'AR',
    gradient: 'from-nebula/20 to-space-800',
  },
  {
    name: 'Dr. Thomas Park',
    title: 'Faculty Advisor',
    major: 'Associate Professor, Aerospace Engineering',
    year: 'University of Michigan',
    bio: 'Provides academic mentorship, institutional support, and technical guidance on NASA competition requirements and aerospace systems.',
    initials: 'TP',
    gradient: 'from-space-600 to-nebula-dark',
  },
]

export default function BoardPage() {
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
            <span className="text-white-90">Executive Board</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Leadership</p>
            <h1 className="text-display-xl text-white mb-6">Executive Board</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Six leaders who set the strategic direction of CLAWS, represent the organization externally, and support our 80+ members throughout the year.
            </p>
          </div>
        </div>
      </section>

      {/* Board Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member) => (
              <div
                key={member.name}
                className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card text-center flex flex-col items-center"
              >
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-xl mb-4 flex-shrink-0`}>
                  {member.initials}
                </div>
                <div className="text-maize text-xs font-semibold uppercase tracking-widest mb-1">{member.title}</div>
                <h3 className="text-white-90 font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-white-50 text-xs mb-1">{member.major}</p>
                <p className="text-white-30 text-xs mb-4">{member.year}</p>
                <p className="text-white-70 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
