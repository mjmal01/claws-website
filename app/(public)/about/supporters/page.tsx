import Link from 'next/link'

const platinum = [
  { name: 'University of Michigan College of Engineering', initials: 'CoE', description: 'Primary institutional sponsor and home department' },
]

const gold = [
  { name: 'Lockheed Martin', initials: 'LM' },
  { name: 'Northrop Grumman', initials: 'NG' },
  { name: 'Raytheon Technologies', initials: 'RT' },
]

const silver = [
  { name: 'Collins Aerospace', initials: 'CA' },
  { name: 'Ball Aerospace', initials: 'BA' },
  { name: 'L3Harris Technologies', initials: 'L3' },
  { name: 'General Dynamics', initials: 'GD' },
]

function LogoCard({ name, initials, description }: { name: string; initials: string; description?: string }) {
  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6 flex flex-col items-center gap-3 shadow-card text-center">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-nebula-dark to-maize/20 flex items-center justify-center text-white font-bold text-lg">
        {initials}
      </div>
      <div>
        <p className="text-white-90 font-medium text-sm">{name}</p>
        {description && <p className="text-white-50 text-xs mt-1">{description}</p>}
      </div>
    </div>
  )
}

export default function SupportersPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>/</span>
            <span className="text-white-90">Supporters</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Partners & Sponsors</p>
            <h1 className="text-display-xl text-white mb-6">Our Supporters</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              CLAWS is made possible through the generous support of institutions and companies who believe in the next generation of space engineers.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Platinum */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">🏆</span>
            <div>
              <h2 className="text-display-sm text-white-90">Platinum Sponsors</h2>
              <p className="text-white-50 text-sm">Our foundational institutional partners</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platinum.map((s) => <LogoCard key={s.name} {...s} />)}
          </div>
        </div>

        {/* Gold */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">🥇</span>
            <div>
              <h2 className="text-display-sm text-white-90">Gold Sponsors</h2>
              <p className="text-white-50 text-sm">Industry leaders supporting student innovation</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gold.map((s) => <LogoCard key={s.name} {...s} />)}
          </div>
        </div>

        {/* Silver */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl">🥈</span>
            <div>
              <h2 className="text-display-sm text-white-90">Silver Sponsors</h2>
              <p className="text-white-50 text-sm">Valued contributors to the CLAWS mission</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {silver.map((s) => <LogoCard key={s.name} {...s} />)}
          </div>
        </div>

        {/* Become a sponsor CTA */}
        <div className="bg-surface rounded-3xl border border-surface-border p-12 text-center shadow-card">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-display-sm text-white-90 mb-4">Become a Sponsor</h2>
          <p className="text-white-70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Partnering with CLAWS gives your organization direct access to Michigan's top engineering talent. We offer logo placement, recruiting access, technical mentorship opportunities, and more.
          </p>
          <Link
            href="/join/contact"
            className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-8 py-4 rounded-xl hover:bg-maize-light transition-colors duration-200"
          >
            Get in Touch
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
