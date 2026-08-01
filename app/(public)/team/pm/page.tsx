import Link from 'next/link'

const goals = [
  'Successfully compete in both NASA SUITS and RASC-AL in the same academic year',
  'Grow active membership to 90+ students by end of Winter semester',
  'Establish 3 new corporate partnerships to fund competition travel and equipment',
  'Launch a mentorship program pairing new members with returning veterans',
  'Improve cross-subteam communication with a new internal project management system',
]

const responsibilities = [
  'Oversee all 9 subteams and ensure alignment with competition deadlines',
  'Chair weekly general body and exec board meetings',
  'Serve as the primary point of contact with NASA competition coordinators',
  'Coordinate travel logistics for competition events at JSC and RASC-AL forum',
  'Represent CLAWS to university administration and external partners',
]

export default function PMPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/team" className="hover:text-white transition-colors">Team</Link>
            <span>/</span>
            <span className="text-white-90">Project Manager</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Project Manager 2024–2025</div>
              <h1 className="text-display-xl text-white mb-4">Alex Johnson</h1>
              <p className="text-white-50 text-lg mb-6">Aerospace Engineering · Class of 2026 · Detroit, MI</p>
              <blockquote className="border-l-4 border-maize pl-6">
                <p className="text-white-70 text-xl italic leading-relaxed">
                  "CLAWS is the closest thing to working at NASA that a college student can experience. My job is to make sure every one of our 80 members feels that way."
                </p>
              </blockquote>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-maize/10 blur-3xl scale-125" />
                <div className="relative w-64 h-64 rounded-full border-4 border-maize/40 shadow-glow-maize overflow-hidden bg-gradient-to-br from-maize/20 via-space-800 to-space-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl mb-2">👩‍🚀</div>
                    <div className="text-white-50 text-xs">AJ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Bio */}
        <section>
          <h2 className="text-display-sm text-white-90 mb-6">About Alex</h2>
          <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card space-y-4 text-white-70 leading-relaxed">
            <p>
              Alex Johnson is a junior studying Aerospace Engineering at the University of Michigan College of Engineering. Originally from Detroit, Alex has been fascinated by human spaceflight since childhood and joined CLAWS as a first-year student with no prior engineering club experience.
            </p>
            <p>
              During their first year, Alex joined the Software subteam and contributed to the NASA SUITS HoloLens application, eventually becoming Software Lead in their sophomore year. In 2024, the CLAWS community elected Alex as Project Manager — making them the youngest PM in club history.
            </p>
            <p>
              Outside of CLAWS, Alex conducts research in the University of Michigan Aerospace Engineering department, focusing on GNC (Guidance, Navigation, and Control) for small satellite missions. Alex is also a mentor in the Michigan Engineering Zone's first-year experience program.
            </p>
          </div>
        </section>

        {/* Role & Responsibilities */}
        <section>
          <h2 className="text-display-sm text-white-90 mb-6">Role & Responsibilities</h2>
          <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card">
            <ul className="space-y-4">
              {responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 rounded-full bg-maize-muted border border-maize/40 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-maize" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-white-70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Year Goals */}
        <section>
          <h2 className="text-display-sm text-white-90 mb-6">Goals for 2024–2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, i) => (
              <div key={goal} className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-maize/10 border border-maize/30 flex items-center justify-center text-maize font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-white-70 text-sm leading-relaxed">{goal}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Message to Team */}
        <section className="bg-surface rounded-3xl border border-surface-border p-12 shadow-card text-center">
          <div className="text-5xl mb-6">💌</div>
          <h2 className="text-display-sm text-white-90 mb-6">Message to the Team</h2>
          <blockquote className="text-white-70 text-lg leading-relaxed max-w-3xl mx-auto italic">
            "Every person on this team chose to spend their college years doing something harder and more meaningful than they had to. That's not lost on me. My commitment to you is to fight for resources, clear obstacles, and make sure that what you build actually matters — not just to us, but to NASA and to the future of human space exploration. Let's make this year legendary."
          </blockquote>
          <p className="text-maize font-semibold mt-8">— Alex Johnson, Project Manager</p>
        </section>
      </div>
    </div>
  )
}
