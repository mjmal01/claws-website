import Link from 'next/link'
import { Accordion } from '@/components/ui/Accordion'

const faqs = [
  {
    question: 'What is CLAWS?',
    answer: 'CLAWS (Collaborative Lab for Advancing Work in Space) is a student organization at the University of Michigan that competes in NASA university design challenges. We build AR astronaut interfaces for the NASA SUITS competition and propose aerospace systems concepts for NASA RASC-AL, giving members hands-on engineering experience with real NASA stakes.',
  },
  {
    question: 'How do I join CLAWS?',
    answer: 'CLAWS recruits new members each semester — typically in September for the fall semester and January for the winter semester. Applications are submitted through our website, followed by a brief interview. No prior experience in aerospace or engineering is required.',
  },
  {
    question: 'What subteams does CLAWS have?',
    answer: 'CLAWS has 9 subteams: Software (flight software, autonomy, embedded systems), Hardware (mechanical design and fabrication), Science (mission science and instruments), Systems (systems engineering), Safety (risk analysis), Outreach (community education), Finance (budgeting and fundraising), Partnerships (corporate relations), and Project Management (planning and coordination).',
  },
  {
    question: 'Is there a GPA requirement to join?',
    answer: 'No, there is no GPA requirement. CLAWS is open to all U of M students regardless of academic standing. We value passion, curiosity, and a willingness to learn above all else.',
  },
  {
    question: 'What is the time commitment?',
    answer: 'Most members dedicate 5–10 hours per week, depending on the competition season. This includes weekly subteam meetings (1–2 hours), general body meetings (1 hour), and independent project work. Time commitment ramps up in spring when we prepare for NASA competitions.',
  },
  {
    question: 'Can I join if I\'m not an engineering student?',
    answer: 'Absolutely. CLAWS welcomes students from all majors and colleges. We have members from LSA, the School of Information, the Ford School of Public Policy, and more. Skills in writing, design, communication, and project management are just as valuable as technical skills.',
  },
  {
    question: 'When and where does CLAWS meet?',
    answer: 'CLAWS holds general body meetings on Tuesday evenings in the Duderstadt Center on North Campus. Subteam meetings are scheduled separately and may be held in person or virtually. Check our community page for current meeting times.',
  },
  {
    question: 'How does CLAWS differ from other engineering clubs?',
    answer: 'CLAWS is unique in that we compete directly in NASA-sanctioned challenges and have our work evaluated by actual NASA engineers. You\'re not just building for fun — you\'re building something that gets tested at Johnson Space Center or presented at a NASA forum. The stakes and the learning are real.',
  },
]

export default function AboutFAQPage() {
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
            <span className="text-white-90">FAQ</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Common Questions</p>
            <h1 className="text-display-xl text-white mb-6">Frequently Asked Questions</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Everything you need to know about CLAWS, our competitions, and how we operate.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion items={faqs} />

          <div className="mt-16 text-center bg-surface rounded-2xl border border-surface-border p-8">
            <p className="text-white-70 mb-4">Still have questions? We'd love to hear from you.</p>
            <Link
              href="/join/contact"
              className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-6 py-3 rounded-xl hover:bg-maize-light transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
