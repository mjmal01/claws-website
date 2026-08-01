import Link from 'next/link'
import { Accordion } from '@/components/ui/Accordion'

const faqs = [
  {
    question: 'How is CLAWS structured?',
    answer: 'CLAWS has three tiers of leadership: the Executive Board (President, VPs, Faculty Advisor), the Project Manager, and 9 Subteam Leads. Below leadership are the general members, who make up the bulk of the team. All major decisions are made collaboratively with input from subteam leads and the exec board.',
  },
  {
    question: 'How are subteam leads chosen?',
    answer: 'Subteam leads are selected each semester through an application and interview process open to returning CLAWS members. The outgoing lead, exec board, and project manager jointly evaluate candidates based on technical ability, leadership potential, communication skills, and commitment to the team.',
  },
  {
    question: 'How do I become a subteam lead?',
    answer: 'To become a lead, you typically need at least one full semester of active CLAWS membership on the subteam you want to lead. When the lead position opens, submit an application describing your vision for the subteam and your leadership experience. Being an active, collaborative member from day one is the best preparation.',
  },
  {
    question: 'Can I switch subteams after joining?',
    answer: 'Yes, subteam switches are possible and happen occasionally. Requests are evaluated at the start of each semester. Switches are more common for members in their first semester who find a better fit. Talk to your subteam lead and the Project Manager if you\'re considering a switch.',
  },
  {
    question: 'How often does the full team meet?',
    answer: 'CLAWS holds a general body meeting once per week (typically Tuesday evenings) where all members come together for announcements, cross-team updates, and guest speaker sessions. Subteams meet separately 1–2 times per week depending on their workload.',
  },
  {
    question: 'Is there a hierarchy within subteams?',
    answer: 'Each subteam is led by a Subteam Lead and may have a Deputy Lead for larger subteams. Beyond that, subteams are relatively flat — all members contribute equally to technical work. Senior members often informally mentor newer ones, but there\'s no formal rank system.',
  },
]

export default function TeamFAQPage() {
  return (
    <div className="min-h-screen bg-space">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white-50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/team" className="hover:text-white transition-colors">Team</Link>
            <span>/</span>
            <span className="text-white-90">FAQ</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Team Structure</p>
            <h1 className="text-display-xl text-white mb-6">Team FAQ</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Questions about how CLAWS is organized, how leads are chosen, and how to get more involved.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion items={faqs} />

          <div className="mt-16 text-center bg-surface rounded-2xl border border-surface-border p-8">
            <p className="text-white-70 mb-4">Have a question about joining the team?</p>
            <Link
              href="/join/faq"
              className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-6 py-3 rounded-xl hover:bg-maize-light transition-colors duration-200"
            >
              See Join FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
