import Link from 'next/link'
import { Accordion } from '@/components/ui/Accordion'

const faqs = [
  {
    question: 'Who can apply to CLAWS?',
    answer: 'Any currently enrolled University of Michigan student can apply. We welcome students from every college, major, and year — from first-year undergrads to doctoral students. CLAWS is intentionally cross-disciplinary.',
  },
  {
    question: 'Do I need prior engineering or aerospace experience?',
    answer: 'No experience is required. We regularly accept students who have never taken an engineering class. What matters is your curiosity and willingness to learn. Every new member goes through onboarding designed to get you up to speed quickly.',
  },
  {
    question: 'When are applications open?',
    answer: 'CLAWS recruits twice per year: Fall semester applications open in early September (typically September 1–15), and Winter semester applications open in early January (typically January 7–21). Follow @umich_claws on Instagram for exact dates.',
  },
  {
    question: 'What does the application consist of?',
    answer: 'The application is a short Google Form (10–15 minutes) asking about your background, interests, which subteam you\'d like to join, and why you want to be part of CLAWS. There\'s no essay, portfolio, or test required.',
  },
  {
    question: 'What happens during the interview?',
    answer: 'Accepted applicants are invited to a 20-minute Zoom call with their preferred subteam lead. It\'s a casual conversation — we\'re not evaluating your technical knowledge. We want to understand your goals, personality, and fit. Most people who are interviewed are offered a spot.',
  },
  {
    question: 'How much time does CLAWS require each week?',
    answer: 'Plan for 5–10 hours per week on average. This includes a 90-minute general body meeting on Tuesday evenings, 1–2 subteam meetings, and independent project work. Time commitment increases in the spring leading up to NASA competition events.',
  },
  {
    question: 'How am I placed in a subteam?',
    answer: 'You indicate your preferred subteam(s) in the application. During the interview, your subteam lead assesses fit. In most cases, you\'ll be placed in your first-choice subteam. Switches are possible after your first semester if you discover a better fit.',
  },
  {
    question: 'Is there a fee to join CLAWS?',
    answer: 'There is a small annual dues fee (typically $20–$30) that goes toward club operations and equipment. This fee may be waived in cases of financial hardship — just let us know when you apply.',
  },
  {
    question: 'Can I join mid-semester?',
    answer: 'Formal recruitment only happens at the start of each semester. However, if you miss the window, you\'re welcome to email us (claws@umich.edu) — we occasionally accommodate late additions for exceptional candidates.',
  },
  {
    question: 'What if I don\'t get in on my first try?',
    answer: 'Don\'t be discouraged. Space in each cohort is limited, and we sometimes turn away qualified applicants simply due to capacity. We encourage you to apply again next semester — and to attend our public events in the meantime to stay connected.',
  },
]

export default function JoinFAQPage() {
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
            <span className="text-white-90">FAQ</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-maize text-sm font-semibold uppercase tracking-widest mb-4">Application Questions</p>
            <h1 className="text-display-xl text-white mb-6">Join FAQ</h1>
            <p className="text-white-70 text-xl leading-relaxed">
              Everything you need to know about applying to CLAWS, from eligibility to subteam placement.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion items={faqs} />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface rounded-2xl border border-surface-border p-6 text-center">
              <p className="text-white-70 mb-4">Ready to apply?</p>
              <Link
                href="/join/apply"
                className="inline-flex items-center gap-2 bg-maize text-space font-semibold px-6 py-3 rounded-xl hover:bg-maize-light transition-colors"
              >
                Start Application
              </Link>
            </div>
            <div className="bg-surface rounded-2xl border border-surface-border p-6 text-center">
              <p className="text-white-70 mb-4">Still have questions?</p>
              <Link
                href="/join/contact"
                className="inline-flex items-center gap-2 bg-surface-raised border border-surface-border text-white-70 hover:text-white hover:border-surface-muted px-6 py-3 rounded-xl transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
