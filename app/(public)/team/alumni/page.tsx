import Link from 'next/link'

const stats = [
  { value: '50+', label: 'Alumni' },
  { value: 'Google · SpaceX · NASA · Boeing · JPL', label: 'Top Companies' },
  { value: '95%', label: 'STEM Career Rate' },
]

const milestones = [
  { year: '2019', event: 'CLAWS founded at University of Michigan with 15 founding members' },
  { year: '2020', event: 'First NASA SUITS competition submission; adapted to remote collaboration during pandemic' },
  { year: '2021', event: 'Competed at NASA JSC for first time; launched RASC-AL participation' },
  { year: '2022', event: 'Grew to 50 active members; first cohort of 12 alumni graduate' },
  { year: '2023', event: 'Top-ranked UI at NASA JSC testing; established corporate partnership program' },
  { year: '2024', event: 'Surpassed 80 active members; alumni network exceeds 50 professionals' },
  { year: '2025', event: 'Competing in both NASA SUITS and RASC-AL simultaneously for the first time' },
]

const spotlights = [
  {
    name: 'Jordan Kim',
    year: 'Class of 2022',
    company: 'SpaceX',
    role: 'Avionics Engineer',
    quote: 'CLAWS gave me real engineering experience before I ever set foot in a professional setting.',
    initials: 'JK',
    gradient: 'from-nebula-dark to-space-800',
  },
  {
    name: 'Priya Mehta',
    year: 'Class of 2023',
    company: 'NASA JPL',
    role: 'Systems Engineer',
    quote: 'The cross-disciplinary collaboration at CLAWS prepared me perfectly for systems engineering.',
    initials: 'PM',
    gradient: 'from-maize/30 to-space-800',
  },
  {
    name: 'Marcus Torres',
    year: 'Class of 2021',
    company: 'Boeing',
    role: 'Software Engineer',
    quote: 'Leading the Software subteam taught me project ownership and technical leadership.',
    initials: 'MT',
    gradient: 'from-space-700 to-nebula-dark',
  },
  {
    name: 'Anika Rao',
    year: 'Class of 2022',
    company: 'Google',
    role: 'Product Manager, Space Products',
    quote: 'CLAWS taught me that the best technical work happens when diverse teams truly collaborate.',
    initials: 'AR',
    gradient: 'from-nebula/20 to-space-900',
  },
  {
    name: 'Chris Lee',
    year: 'Class of 2023',
    company: 'Northrop Grumman',
    role: 'Mission Systems Engineer',
    quote: 'Nothing prepares you for NASA like actually working with NASA. CLAWS gave me that.',
    initials: 'CL',
    gradient: 'from-maize/20 to-nebula-dark',
  },
  {
    name: 'Fatima Al-Hassan',
    year: 'Class of 2021',
    company: 'Lockheed Martin',
    role: 'Propulsion Engineer',
    quote: 'The rigor we applied to RASC-AL proposals directly translated to writing engineering specs at Lockheed.',
    initials: 'FA',
    gradient: 'from-space-800 to-nebula-dark',
  },
]

export default function AlumniPage() {
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
            <span className="text-white-90">Alumni</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Alumni Network</p>
            <h1 className="text-display-xl text-white mb-6">CLAWS Alumni</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              50+ CLAWS alumni are shaping the aerospace industry at NASA, SpaceX, Boeing, Google, and beyond. CLAWS is where careers in space begin.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface rounded-2xl border border-surface-border p-8 text-center shadow-card">
              <div className="text-display-sm text-maize mb-2">{stat.value}</div>
              <div className="text-white-50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-display-sm text-white-90 mb-10">CLAWS Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-border" />
            <div className="space-y-8 pl-12">
              {milestones.map((m) => (
                <div key={m.year} className="relative">
                  <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-maize border-2 border-space" />
                  <div className="flex items-start gap-4">
                    <span className="text-maize font-bold text-sm w-10 flex-shrink-0">{m.year}</span>
                    <p className="text-white-70 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spotlights */}
        <div>
          <h2 className="text-display-sm text-white-90 mb-10">Alumni Spotlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotlights.map((alumni) => (
              <div key={alumni.name} className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card flex flex-col">
                <svg className="w-8 h-8 text-maize/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white-70 text-sm leading-relaxed flex-1 mb-6 italic">{alumni.quote}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${alumni.gradient} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                    {alumni.initials}
                  </div>
                  <div>
                    <div className="text-white-90 font-medium text-sm">{alumni.name}</div>
                    <div className="text-white-50 text-xs">{alumni.role} · {alumni.company}</div>
                    <div className="text-maize text-xs mt-0.5">{alumni.year}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
