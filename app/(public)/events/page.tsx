import Link from 'next/link'

const upcomingEvents = [
  {
    date: 'Apr 7–11, 2025',
    title: 'NASA SUITS Competition @ JSC',
    type: 'Competition',
    typeBadge: 'bg-maize-muted text-maize border-maize/30',
    location: 'NASA Johnson Space Center, Houston, TX',
    description: 'CLAWS travels to Houston to test our HoloLens AR interface with astronaut trainers in simulated EVA scenarios.',
  },
  {
    date: 'Jun 16–18, 2025',
    title: 'RASC-AL Forum Presentation',
    type: 'Competition',
    typeBadge: 'bg-maize-muted text-maize border-maize/30',
    location: 'Cocoa Beach, FL',
    description: 'Our RASC-AL team presents our lunar resource architecture proposal to NASA engineers and aerospace industry judges.',
  },
  {
    date: 'Sep 8, 2025',
    title: 'Fall Recruitment Info Night',
    type: 'Recruitment',
    typeBadge: 'bg-nebula-muted text-nebula border-nebula/30',
    location: 'Duderstadt Center, Ann Arbor',
    description: 'Meet the team, learn about our projects, and find out how to apply for the fall semester cohort.',
  },
]

const socialLinks = [
  { platform: 'Instagram', handle: '@umich_claws', href: 'https://instagram.com', icon: '📸' },
  { platform: 'LinkedIn', handle: 'CLAWS at Michigan', href: 'https://linkedin.com', icon: '💼' },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white-90">Events</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">What's Happening</p>
            <h1 className="text-display-xl text-white mb-6">Events & News</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              From NASA competition travel to weekly meetings and community outreach — there's always something happening at CLAWS.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left — upcoming events */}
            <div className="lg:col-span-2">
              <h2 className="text-display-sm text-white-90 mb-8">Upcoming Events</h2>
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.title}
                    className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${event.typeBadge} mb-2`}>
                          {event.type}
                        </span>
                        <h3 className="text-white-90 font-semibold text-lg">{event.title}</h3>
                      </div>
                      <div className="text-maize text-sm font-medium flex-shrink-0">{event.date}</div>
                    </div>
                    <div className="flex items-center gap-2 text-white-50 text-sm mb-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    <p className="text-white-70 text-sm leading-relaxed">{event.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/events/news"
                  className="inline-flex items-center gap-2 text-nebula text-sm font-medium hover:text-nebula-light transition-colors"
                >
                  See latest news
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right — community + social */}
            <div className="space-y-8">
              <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-white-90 font-semibold text-lg mb-3">Community at CLAWS</h3>
                <p className="text-white-70 text-sm leading-relaxed mb-4">
                  CLAWS isn't just a club — it's a community. We host social events, stargazing nights, and end-of-semester celebrations that bring the whole team together outside of project work.
                </p>
                <Link
                  href="/events/community"
                  className="inline-flex items-center gap-2 text-nebula text-sm font-medium hover:text-nebula-light transition-colors"
                >
                  Learn about community
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card">
                <h3 className="text-white-90 font-semibold text-lg mb-4">Follow Us</h3>
                <div className="space-y-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white-70 hover:text-white transition-colors text-sm"
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <div>
                        <div className="font-medium">{link.platform}</div>
                        <div className="text-white-50 text-xs">{link.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-maize-muted border border-maize/30 rounded-2xl p-6">
                <h3 className="text-maize font-semibold text-lg mb-2">Ready to Join?</h3>
                <p className="text-white-70 text-sm mb-4">Applications open each semester. No experience required.</p>
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-5 py-2.5 rounded-xl hover:bg-maize-light transition-colors text-sm"
                >
                  Apply to CLAWS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
