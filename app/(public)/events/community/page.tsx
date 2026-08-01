import Link from 'next/link'

const annualEvents = [
  {
    name: 'Fall Kickoff Night',
    emoji: '🚀',
    timing: 'September',
    description: 'Our biggest social event of the year — new members meet the full team, we reveal our competition goals, and there\'s food, games, and a whole lot of space enthusiasm.',
  },
  {
    name: 'Stargazing Night',
    emoji: '🌌',
    timing: 'October / February',
    description: 'CLAWS teams up with the University of Michigan Astronomical Society for a stargazing night at one of Michigan\'s dark sky locations. Part teambuilding, part nerding out about the cosmos.',
  },
  {
    name: 'End-of-Year Celebration',
    emoji: '🎉',
    timing: 'April',
    description: 'After competition season wraps up, the whole team celebrates the year\'s achievements. We reflect, give awards, say goodbye to graduating seniors, and get excited for what\'s next.',
  },
]

const socialLinks = [
  {
    platform: 'Instagram',
    handle: '@umich_claws',
    description: 'Behind-the-scenes content, team highlights, and competition updates',
    href: 'https://www.instagram.com/claws_um/',
    emoji: '📸',
  },
  {
    platform: 'LinkedIn',
    handle: 'CLAWS at University of Michigan',
    description: 'Professional updates, alumni spotlights, and partnership announcements',
    href: 'https://www.linkedin.com/company/claws-um/',
    emoji: '💼',
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <span>/</span>
            <span className="text-white-90">Community</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Life at CLAWS</p>
            <h1 className="text-display-xl text-white mb-6">Community</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              CLAWS is more than a club. It's a tight-knit community of students who love space, love building things, and genuinely enjoy each other's company.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Weekly Meetings */}
        <section>
          <h2 className="text-display-sm text-white-90 mb-8">Weekly Meetings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-white-90 font-semibold text-lg mb-3">General Body Meeting</h3>
              <div className="space-y-2 text-white-70 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-maize flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Every Tuesday, 7:00 – 8:30 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-maize flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>Duderstadt Center, Room 2045, Ann Arbor</span>
                </div>
              </div>
              <p className="text-white-50 text-sm mt-4 leading-relaxed">
                All members attend. We cover cross-team updates, guest speakers, competition milestones, and community announcements.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-white-90 font-semibold text-lg mb-3">Subteam Meetings</h3>
              <div className="space-y-2 text-white-70 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-maize flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>1–2x per week, varies by subteam</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-maize flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>Duderstadt Center or virtual (Discord)</span>
                </div>
              </div>
              <p className="text-white-50 text-sm mt-4 leading-relaxed">
                Smaller, focused working sessions where your subteam makes real progress on competition deliverables. These are where the actual building happens.
              </p>
            </div>
          </div>
        </section>

        {/* Annual Events */}
        <section>
          <h2 className="text-display-sm text-white-90 mb-8">Annual Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {annualEvents.map((event) => (
              <div key={event.name} className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card">
                <div className="text-5xl mb-4">{event.emoji}</div>
                <div className="text-maize text-xs font-semibold uppercase tracking-widest mb-2">{event.timing}</div>
                <h3 className="text-white-90 font-semibold text-lg mb-3">{event.name}</h3>
                <p className="text-white-70 text-sm leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Media */}
        <section>
          <h2 className="text-display-sm text-white-90 mb-8">Stay Connected</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-surface rounded-2xl border border-surface-border p-6 shadow-card hover:shadow-card-hover hover:border-surface-muted transition-all duration-300 flex items-start gap-5"
              >
                <div className="text-5xl">{link.emoji}</div>
                <div>
                  <div className="text-maize text-sm font-semibold mb-1">{link.handle}</div>
                  <h3 className="text-white-90 font-semibold text-lg mb-2 group-hover:text-white transition-colors">{link.platform}</h3>
                  <p className="text-white-50 text-sm">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface rounded-3xl border border-surface-border p-12 text-center shadow-card">
          <div className="text-5xl mb-4">💫</div>
          <h2 className="text-display-sm text-white-90 mb-4">Become Part of the Community</h2>
          <p className="text-white-70 text-lg max-w-xl mx-auto mb-8">
            The best way to experience CLAWS is to be part of it. Apply to join us this semester.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-8 py-4 rounded-xl hover:bg-maize-light transition-colors duration-200"
          >
            Apply to CLAWS
          </Link>
        </section>
      </div>
    </div>
  )
}
