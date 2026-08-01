import Link from 'next/link'

const requirements = [
  'Currently enrolled University of Michigan student (any college)',
  'Any major or year — from first-years to PhDs',
  'Passion for space exploration and/or engineering',
  'Ability to commit 5–10 hours per week during the semester',
]

const timeline = [
  { step: 'Application Opens', timing: 'September 1 / January 7', description: 'Applications go live on our website.' },
  { step: 'Application Deadline', timing: 'September 15 / January 21', description: 'All applications must be submitted by 11:59 PM.' },
  { step: 'Interview Period', timing: 'September 16–22 / January 22–28', description: 'Subteam leads schedule brief 20-minute Zoom calls.' },
  { step: 'Decisions Released', timing: 'September 25 / January 31', description: 'Accepted applicants receive email invitations.' },
  { step: 'First Meeting', timing: 'First week of October / February', description: 'Welcome aboard! Your first general body meeting.' },
]

export default function ApplyPage() {
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
            <span className="text-white-90">Apply</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Recruitment</p>
            <h1 className="text-display-xl text-white mb-6">Apply to CLAWS</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Our application is short, welcoming, and designed to find the best fit — not to filter people out. We want to get to know you.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Recruitment Info */}
        <div className="bg-maize-muted border border-maize/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📅</span>
            <div>
              <h2 className="text-maize font-semibold text-xl mb-2">When We Recruit</h2>
              <p className="text-white-70 leading-relaxed">
                CLAWS runs two recruitment cycles per year: <strong className="text-white-90">Fall semester</strong> (applications open early September) and <strong className="text-white-90">Winter semester</strong> (applications open early January). Applications are open for approximately two weeks, followed by a brief interview period.
              </p>
              <p className="text-white-50 text-sm mt-3">
                Check our Instagram <strong>@umich_claws</strong> for exact dates each semester.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Application Form Placeholder */}
          <div>
            <h2 className="text-display-sm text-white-90 mb-6">Application Form</h2>
            <div className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-white-90 font-semibold text-xl mb-3">Application Form</h3>
              <p className="text-white-50 text-sm mb-4 leading-relaxed">
                Our application is hosted on Google Forms. It takes approximately 10–15 minutes to complete and asks about your background, interests, and preferred subteam.
              </p>
              <p className="text-white-30 text-xs mb-6">Applications open each September and January.</p>
              <button
                disabled
                className="inline-flex items-center gap-2 bg-maize/30 text-maize/60 font-semibold px-8 py-4 rounded-xl cursor-not-allowed text-base"
              >
                Applications Currently Closed
              </button>
              <p className="text-white-30 text-xs mt-3">Check back in September for fall recruitment</p>
            </div>
          </div>

          {/* Requirements & Timeline */}
          <div className="space-y-8">
            <div>
              <h2 className="text-display-sm text-white-90 mb-6">Requirements</h2>
              <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-card">
                <ul className="space-y-3">
                  {requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-maize-muted border border-maize/40 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-maize" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-white-70 text-sm leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-display-sm text-white-90 mb-8">Application Timeline</h2>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={item.step} className="flex items-start gap-6 bg-surface rounded-2xl border border-surface-border p-6 shadow-card">
                <div className="w-8 h-8 rounded-xl bg-maize/10 border border-maize/30 flex items-center justify-center text-maize font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="text-white-90 font-semibold">{item.step}</h3>
                    <span className="text-maize text-sm">{item.timing}</span>
                  </div>
                  <p className="text-white-50 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
