import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Apply',
    description: 'Fill out our short application form sharing your background and which subteam interests you most. No prior experience required.',
    cta: 'Start Application',
    href: '/join/apply',
  },
  {
    number: '02',
    title: 'Interview',
    description: 'A brief 20-minute conversation with a subteam lead. We\'re not testing you — we\'re getting to know you and finding your best fit.',
    cta: null,
    href: null,
  },
  {
    number: '03',
    title: 'Welcome',
    description: 'You\'re in! Attend your first general body meeting, get matched with your subteam, and start building the future of space exploration.',
    cta: null,
    href: null,
  },
]

const facts = [
  { icon: '🎓', label: 'Open to all majors' },
  { icon: '✅', label: 'No experience required' },
  { icon: '🛠️', label: 'Hands-on from day one' },
  { icon: '🌍', label: 'All years welcome' },
]

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Recruitment</p>
          <h1 className="text-display-2xl text-white mb-6 max-w-4xl mx-auto">
            Join CLAWS —<br />Shape the Future of Space
          </h1>
          <p className="text-white-70 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            80+ Michigan students competing in NASA challenges. We're looking for curious, driven people who want to build real things that matter. Any major. Any year. No experience required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join/apply"
              className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-8 py-4 rounded-xl hover:bg-maize-light transition-colors duration-200 text-base"
            >
              Apply Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/join/faq"
              className="inline-flex items-center gap-2 bg-surface-raised border border-surface-border text-white-70 hover:text-white hover:border-surface-muted px-8 py-4 rounded-xl transition-all duration-200 text-base"
            >
              Have Questions?
            </Link>
          </div>
        </div>
      </section>

      {/* Facts bar */}
      <section className="py-8 bg-surface border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-10">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3">
                <span className="text-2xl">{fact.icon}</span>
                <span className="text-white-70 font-medium">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-md text-white-90 mb-4">How to Join</h2>
            <p className="text-white-50 text-lg">Three simple steps from application to launch.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-surface-border z-0" style={{ width: 'calc(100% - 3rem)', left: 'calc(50% + 3rem)' }} />
                )}
                <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card text-center h-full flex flex-col">
                  <div className="w-16 h-16 rounded-2xl bg-maize-muted border border-maize/30 flex items-center justify-center text-maize font-bold text-2xl mx-auto mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-white-90 font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-white-50 text-sm leading-relaxed flex-1">{step.description}</p>
                  {step.cta && step.href && (
                    <div className="mt-6">
                      <Link
                        href={step.href}
                        className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-6 py-3 rounded-xl hover:bg-maize-light transition-colors text-sm"
                      >
                        {step.cta}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTAs */}
      <section className="py-16 bg-surface border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-raised rounded-2xl border border-surface-border p-8 text-center shadow-card">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-white-90 font-semibold text-xl mb-3">Ready to Apply?</h3>
              <p className="text-white-50 text-sm mb-6">Applications open each September and January.</p>
              <Link
                href="/join/apply"
                className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-8 py-3 rounded-xl hover:bg-maize-light transition-colors"
              >
                Apply Now
              </Link>
            </div>
            <div className="bg-surface-raised rounded-2xl border border-surface-border p-8 text-center shadow-card">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-white-90 font-semibold text-xl mb-3">Have Questions?</h3>
              <p className="text-white-50 text-sm mb-6">Reach out via email, Instagram, or come to an info night.</p>
              <Link
                href="/join/contact"
                className="inline-flex items-center gap-2 bg-surface border border-surface-border text-white-70 hover:text-white hover:border-surface-muted px-8 py-3 rounded-xl transition-all duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
