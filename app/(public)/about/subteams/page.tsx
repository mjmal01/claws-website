import Link from 'next/link'
import { SubteamCard } from '@/components/public/SubteamCard'

const subteams = [
  {
    icon: '⚙️',
    name: 'Hardware',
    description: 'The Hardware Team leads physical systems design and prototyping efforts for NASA\'s RASC-AL challenge, building pressurized rovers and electronic systems.',
    memberCount: 16,
  },
  {
    icon: '🔬',
    name: 'Research',
    description: 'The Research Team drives technical documentation, grant applications, and studies to advance our AR and space systems work.',
    memberCount: 10,
  },
  {
    icon: '🤖',
    name: 'Artificial Intelligence',
    description: 'The AI Team develops intelligent systems and machine learning solutions for our space exploration platforms.',
    memberCount: 10,
  },
  {
    icon: '📣',
    name: 'Outreach',
    description: 'The Outreach Team engages the broader Michigan community through events, K-12 education, and public demonstrations.',
    memberCount: 8,
  },
  {
    icon: '🎨',
    name: 'UX Design',
    description: 'The UX Team designs intuitive interfaces for astronaut AR systems with an emphasis on human factors and usability.',
    memberCount: 10,
  },
  {
    icon: '🎉',
    name: 'Social',
    description: 'The Social Team coordinates team-building events, social gatherings, and internal community initiatives.',
    memberCount: 6,
  },
  {
    icon: '🏗️',
    name: 'Infrastructure',
    description: 'The Infrastructure Team builds and maintains the web systems, data pipelines, and mission control software.',
    memberCount: 8,
  },
  {
    icon: '💰',
    name: 'Finance',
    description: 'The Finance Team manages team budgets, processes grant applications, and coordinates fundraising efforts.',
    memberCount: 5,
  },
  {
    icon: '🥽',
    name: 'Augmented Reality',
    description: 'The AR Team builds the core augmented reality software and hardware interfaces for NASA\'s SUITS challenge.',
    memberCount: 18,
  },
  {
    icon: '📸',
    name: 'Content',
    description: 'The Content Team creates photography, video, and social media content documenting CLAWS\'s work and achievements.',
    memberCount: 6,
  },
]

export default function SubteamsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>/</span>
            <span className="text-white/90">Subteams</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Organizational Structure</p>
            <h1 className="text-display-xl text-white mb-6 font-bold">Our Subteams</h1>
            <p className="text-white/70 text-xl leading-relaxed">
              CLAWS is organized into 10 specialized subteams. Every member is placed on a subteam that matches their skills and interests — and there&apos;s a place for everyone, from first-year students to PhD candidates.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-[#0d0d0d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-white/70 leading-relaxed">
              When you join CLAWS, you&apos;ll be matched with a subteam during the onboarding process based on your background, goals, and interest. Subteams meet weekly and collaborate closely during competition seasons. Leads are chosen from experienced members each semester.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subteams.map((team) => (
              <SubteamCard key={team.name} {...team} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d0d0d] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-sm text-white mb-4 font-bold">Ready to Join a Subteam?</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            Applications open each semester. No experience required — just a passion for space exploration.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 bg-maize text-black font-semibold px-8 py-4 rounded-xl hover:bg-maize-light transition-colors duration-200"
          >
            Apply to CLAWS
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
