import Link from 'next/link'

const newsPosts = [
  {
    date: 'March 2, 2025',
    category: 'Competition',
    headline: 'CLAWS Selected for NASA SUITS 2025 — Heading Back to JSC',
    excerpt: 'We\'re thrilled to announce that CLAWS has been selected to compete in the 2025 NASA SUITS Challenge at Johnson Space Center this April. This marks our fourth consecutive year competing at JSC, and we\'re bringing our most polished HoloLens interface yet — featuring real-time LIDAR mapping and voice-command integration.',
  },
  {
    date: 'January 15, 2025',
    category: 'Partnership',
    headline: 'CLAWS Partners with Northrop Grumman for 2025 Season',
    excerpt: 'We\'re excited to announce a new partnership with Northrop Grumman, who will provide technical mentorship, access to engineering resources, and direct support for our RASC-AL proposal. This partnership reflects the growing industry recognition of the caliber of work CLAWS produces each year.',
  },
  {
    date: 'December 10, 2024',
    category: 'Milestone',
    headline: 'CLAWS Reaches 80+ Active Members — A Club Record',
    excerpt: 'Fall 2024 recruitment was our most successful ever, bringing CLAWS to over 80 active members across 9 subteams. The incoming class of 22 new members brings expertise in software, mechanical design, and business that will strengthen every aspect of our competition efforts.',
  },
  {
    date: 'June 20, 2024',
    category: 'Competition',
    headline: 'CLAWS Presents at RASC-AL Forum in Cocoa Beach',
    excerpt: 'Our RASC-AL team presented our lunar ISRU architecture proposal to a panel of NASA engineers and aerospace industry judges at the 2024 forum in Cocoa Beach, Florida. The judges praised the depth of our technical analysis and the creativity of our mission concept. Full competition report available on the member portal.',
  },
]

const categoryColors: Record<string, string> = {
  Competition: 'bg-maize-muted text-maize border-maize/30',
  Partnership: 'bg-nebula-muted text-nebula border-nebula/30',
  Milestone: 'bg-white-10 text-white-70 border-surface-border',
}

export default function NewsPage() {
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
            <span className="text-white-90">News</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Latest Updates</p>
            <h1 className="text-display-xl text-white mb-6">CLAWS News</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Announcements, competition results, new partnerships, and milestones from the CLAWS community.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {newsPosts.map((post) => (
              <article
                key={post.headline}
                className="bg-surface rounded-2xl border border-surface-border p-8 shadow-card"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category] ?? 'bg-white-10 text-white-50 border-surface-border'}`}>
                    {post.category}
                  </span>
                  <span className="text-white-50 text-sm">{post.date}</span>
                </div>
                <h2 className="text-white-90 font-semibold text-xl mb-3 hover:text-white transition-colors cursor-pointer leading-snug">
                  {post.headline}
                </h2>
                <p className="text-white-70 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
