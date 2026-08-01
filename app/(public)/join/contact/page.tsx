import Link from 'next/link'

const officeHours = [
  { day: 'Monday', time: '6:00 – 8:00 PM', location: 'Duderstadt Center, Room 1024' },
  { day: 'Wednesday', time: '6:00 – 8:00 PM', location: 'Duderstadt Center, Room 1024' },
]

const contactMethods = [
  {
    method: 'Email',
    value: 'claws@umich.edu',
    description: 'Best for formal inquiries, sponsorship questions, and anything that needs a paper trail.',
    emoji: '📧',
    href: 'mailto:claws@umich.edu',
    cta: 'Send Email',
  },
  {
    method: 'Instagram',
    value: '@umich_claws',
    description: 'DM us for casual questions, recruitment info, or to just say hi. We respond within 24 hours.',
    emoji: '📸',
    href: 'https://www.instagram.com/claws_um/',
    cta: 'Message on Instagram',
  },
  {
    method: 'LinkedIn',
    value: 'CLAWS at University of Michigan',
    description: 'Connect for professional networking, alumni outreach, or corporate partnership discussions.',
    emoji: '💼',
    href: 'https://www.linkedin.com/company/claws-um/',
    cta: 'Connect on LinkedIn',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/join" className="hover:text-white transition-colors">Join</Link>
            <span>/</span>
            <span className="text-white-90">Contact</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Get in Touch</p>
            <h1 className="text-display-xl text-white mb-6">Contact CLAWS</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Have questions about joining, sponsoring, or collaborating with CLAWS? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Contact Methods */}
        <div>
          <h2 className="text-display-sm text-white-90 mb-8">How to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <div key={method.method} className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card flex flex-col">
                <div className="text-4xl mb-4">{method.emoji}</div>
                <div className="text-maize text-xs font-semibold uppercase tracking-widest mb-2">{method.method}</div>
                <h3 className="text-white-90 font-medium text-base mb-2">{method.value}</h3>
                <p className="text-white-50 text-sm leading-relaxed flex-1 mb-6">{method.description}</p>
                <a
                  href={method.href}
                  target={method.method !== 'Email' ? '_blank' : undefined}
                  rel={method.method !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 bg-surface-raised border border-surface-border text-white-70 hover:text-white hover:border-surface-muted px-5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium"
                >
                  {method.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Office Hours */}
        <div>
          <h2 className="text-display-sm text-white-90 mb-8">Drop-In Office Hours</h2>
          <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card">
            <p className="text-white-70 mb-6 leading-relaxed">
              CLAWS leadership holds open office hours twice a week during the academic year. Stop by to ask questions, learn more about the club, or just hang out. No appointment needed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {officeHours.map((oh) => (
                <div key={oh.day} className="bg-surface-raised rounded-xl border border-surface-border p-5">
                  <div className="text-maize font-semibold mb-1">{oh.day}</div>
                  <div className="text-white-90 font-medium mb-1">{oh.time}</div>
                  <div className="text-white-50 text-sm">{oh.location}</div>
                </div>
              ))}
            </div>
            <p className="text-white-30 text-xs mt-4">
              Office hours run during fall and winter semesters only. Check Instagram for schedule changes.
            </p>
          </div>
        </div>

        {/* Quick FAQ note */}
        <div className="bg-nebula-muted border border-nebula/30 rounded-2xl p-8 flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="text-white-90 font-semibold text-lg mb-2">Looking for Answers?</h3>
            <p className="text-white-70 text-sm leading-relaxed mb-4">
              Many common questions are answered in our FAQ pages. Check there before reaching out — you might get an instant answer!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/join/faq" className="text-nebula text-sm font-medium hover:text-nebula-light transition-colors inline-flex items-center gap-1">
                Join FAQ
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/about/faq" className="text-nebula text-sm font-medium hover:text-nebula-light transition-colors inline-flex items-center gap-1">
                About FAQ
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
