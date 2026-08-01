'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, type Variants } from 'framer-motion'

/* ─── Animation helpers ────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const

function useFade(margin = '-80px') {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin } as Parameters<typeof useInView>[1])
  return { ref, inView }
}

/** Fades + slides up when scrolled into view */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useFade()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Slides in from left or right */
function FadeSide({
  children,
  from,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  from: 'left' | 'right'
  delay?: number
  className?: string
}) {
  const { ref, inView } = useFade()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: from === 'left' ? -48 : 48 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Stagger container + child variants */
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/* ─── Section divider ──────────────────────────────────────────────── */
function SectionDivider({ label }: { label: string }) {
  const { ref, inView } = useFade('-40px')
  return (
    <div ref={ref} className="flex items-center gap-5 py-16">
      <motion.div
        className="flex-1 h-px bg-white"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        style={{ transformOrigin: 'right center' }}
        transition={{ duration: 0.9, ease }}
      />
      <motion.h2
        className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-none text-white"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease, delay: 0.15 }}
      >
        {label}
      </motion.h2>
      <motion.div
        className="flex-1 h-px bg-white"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        style={{ transformOrigin: 'left center' }}
        transition={{ duration: 0.9, ease, delay: 0.05 }}
      />
    </div>
  )
}

/* ─── Photo carousel ──────────────────────────────────────────────── */
type Slide = { src: string; caption: string }

const slideSets: Record<string, Slide[]> = {
  overview: [
    { src: '/images/gallery/pEVWzdM1BF8uYezhjODHp19x8.jpg',        caption: 'Anirudh Annavarapu & Molly Maloney — Project Managers' },
    { src: '/images/gallery/RU3qL5AU7W6VhIR65kt8AW74l8E.jpg',       caption: 'Team photo with the CLAWS logo projected on screen' },
    { src: '/images/gallery/LteD9i5xY3gBZSQCOhmuWqa2OFw.jpg',       caption: 'General body meeting presentation' },
    { src: '/images/gallery/GihLjfXmM2n1e2LR3Zm8kIT7JM.jpg',        caption: 'Team social event' },
  ],
  suits1: [
    { src: '/images/gallery/i5wLWh75JaoNnm8ST0iAee4V78Y.jpg',       caption: 'UX team testing AR interfaces at JSC' },
    { src: '/images/gallery/cwmr174q3sgfvP2h3Pwlv66RzqQ.jpg',       caption: 'Member in lit suit at JSC testing site' },
    { src: '/images/gallery/g7nyImfAONWaCiWbAKDUwyuM2c0.jpg',       caption: 'AR interface testing during EVA simulation' },
  ],
  suits2: [
    { src: '/images/gallery/Ph9wXWb6TZIO6NsAMoLKXYLE7c.jpg',        caption: 'CLAWS presenting at the SUITS finalist briefing' },
    { src: '/images/gallery/nixIZASo9IOyHeRLJ0hXjU1I.jpg',          caption: 'Team demo at the JSC rockyard' },
    { src: '/images/gallery/zHOSVmapK9oR22t3cmAPfmc.jpg',           caption: 'AR waypoint navigation during simulated mission' },
  ],
  suits3: [
    { src: '/images/gallery/ADZwCw5b52fwYVSKN1NQCKOGzU8.jpg',       caption: 'AURA system poster presentation' },
    { src: '/images/gallery/Rsho2rNpvnmDe60Yg5hP7fmy94.jpg',        caption: 'SUITS and Artemis program banners at JSC' },
    { src: '/images/gallery/9DcYywPd3lm1vS3qmM2nsPAzlY.jpg',        caption: 'Team members after final evaluation' },
  ],
  rascal1: [
    { src: '/images/gallery/juVYmX9tChfiyO6jgwUPdiBInQc.jpg',       caption: 'Hardware team working in the makerspace' },
    { src: '/images/gallery/GbZnTXnbK0omF8tpwAmnwfLEn4.jpg',        caption: 'Hardware team building the pressurized rover' },
  ],
  rascal2: [
    { src: '/images/gallery/p2FgKMvUbCa9vNw7Dyl44wcw42o.jpg',       caption: 'UX team reviewing wireframes and design layouts' },
    { src: '/images/gallery/arOPAKG2qUoVdJ9IYBD1JH7ajQU.jpg',       caption: 'Team coding session on large display' },
  ],
}

function PhotoCarousel({ slides }: { slides: Slide[] }) {
  const [idx, setIdx] = useState(0)
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#111]">
      <Image
        src={slides[idx].src}
        alt={slides[idx].caption}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <p className="text-white/80 text-sm leading-snug">{slides[idx].caption}</p>
      </div>
      {slides.length > 1 && (
        <>
          {idx > 0 && (
            <button
              onClick={() => setIdx(i => i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {idx < slides.length - 1 && (
            <button
              onClick={() => setIdx(i => i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Animated two-column content pair ─────────────────────────────── */
function ContentPair({
  left,
  right,
  className,
}: {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${className ?? ''}`}>
      <FadeSide from="left">{left}</FadeSide>
      <FadeSide from="right" delay={0.12}>{right}</FadeSide>
    </div>
  )
}

/* ─── Subteam card ─────────────────────────────────────────────────── */
function SubCard({
  name,
  subtitle,
  gradient,
  icon,
  large,
}: {
  name: string
  subtitle: string
  gradient: string
  icon: React.ReactNode
  large?: boolean
}) {
  return (
    <motion.div
      variants={staggerChild}
      className={`relative rounded-2xl overflow-hidden border border-white/10 p-8 flex flex-col items-center text-center gap-4 ${large ? 'py-14' : 'py-10'} ${gradient} h-full hover:border-white/20 transition-colors duration-300`}
    >
      <div className="text-white/90">{icon}</div>
      <p className="text-white font-bold text-xl">{name}</p>
      <p className="text-white/65 text-sm leading-snug">{subtitle}</p>
    </motion.div>
  )
}

/* ─── Stagger grid wrapper ─────────────────────────────────────────── */
function StaggerGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' } as Parameters<typeof useInView>[1])
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

/* ─── Project cards ─────────────────────────────────────────────────── */
function FeaturedProject({
  name,
  label,
  description,
  icon,
}: {
  name: string
  label: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <motion.div
      variants={staggerChild}
      className="flex-1 bg-[#0d1020] border border-white/10 rounded-2xl p-8 flex flex-col gap-4 hover:border-white/20 transition-colors duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="text-white/80">{icon}</div>
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">{label}</p>
            <p className="text-white font-black text-3xl italic">{name}</p>
          </div>
        </div>
        <span className="text-white/50 text-sm font-semibold tracking-wide">VIEW ▶</span>
      </div>
      <p className="text-white/65 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

function PastProject({
  name,
  year,
  mission,
  icon,
}: {
  name: string
  year: string
  mission: string
  icon: React.ReactNode
}) {
  return (
    <motion.div
      variants={staggerChild}
      className="bg-[#0d1020] border border-white/10 rounded-xl p-6 flex flex-col items-center text-center gap-3 hover:border-white/20 transition-colors duration-300"
    >
      <div className="text-white/70">{icon}</div>
      <p className="text-white font-bold text-lg">{name}</p>
      <p className="text-white/50 text-xs">{year}</p>
      <p className="text-white/40 text-xs">{mission}</p>
    </motion.div>
  )
}

/* ─── SVG icons ────────────────────────────────────────────────────── */
const Icons = {
  software: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="10" width="36" height="28" rx="3" />
      <path d="M16 20l-4 4 4 4M32 20l4 4-4 4M22 30l4-12" />
    </svg>
  ),
  hardware: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="14" width="20" height="20" rx="2" />
      <rect x="18" y="18" width="12" height="12" rx="1" />
      <path d="M14 20H6M14 28H6M34 20h8M34 28h8M20 14V6M28 14V6M20 34v8M28 34v8" />
    </svg>
  ),
  ux: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 36l8-8 6 6 10-14" />
      <circle cx="38" cy="12" r="4" />
      <path d="M6 42h36" />
    </svg>
  ),
  research: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="22" cy="22" r="12" />
      <path d="M31 31l9 9" strokeWidth="2.5" />
      <path d="M18 22h8M22 18v8" />
    </svg>
  ),
  business: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="20" width="32" height="22" rx="2" />
      <path d="M16 20v-4a8 8 0 0116 0v4" />
      <path d="M24 30v4M20 30h8" />
    </svg>
  ),
  gemini: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="20" r="8" /><circle cx="26" cy="20" r="8" />
    </svg>
  ),
  polaris: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M20 4v32M4 20h32M8 8l24 24M32 8L8 32" />
    </svg>
  ),
  aura: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="18" r="6" /><circle cx="18" cy="18" r="10" strokeOpacity="0.5" /><circle cx="18" cy="18" r="14" strokeOpacity="0.25" />
    </svg>
  ),
  iris: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <ellipse cx="18" cy="18" rx="14" ry="8" /><circle cx="18" cy="18" r="5" /><circle cx="18" cy="18" r="2" fill="currentColor" />
    </svg>
  ),
  nova: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 4C18 4 10 13 10 20a8 8 0 0016 0c0-7-8-16-8-16z" /><path d="M18 28v4M14 30h8" />
    </svg>
  ),
  hoshi: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 4l2.5 8H29l-7 5 2.5 8-7-5-7 5 2.5-8-7-5h8.5z" />
    </svg>
  ),
  atlas: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="18" cy="18" r="14" /><ellipse cx="18" cy="18" rx="6" ry="14" /><path d="M4 18h28" />
    </svg>
  ),
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="bg-black text-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] flex items-end justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a2e] via-[#0a1020] to-black" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[28rem] select-none">🥽</span>
        </div>
        <div className="relative z-10 w-full text-center pb-16 px-6">
          <motion.h1
            className="text-7xl md:text-9xl font-black text-white leading-none mb-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            About Us
          </motion.h1>
        </div>
      </section>

      {/* ── Intro paragraph ── */}
      <FadeUp className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-white/80 text-xl md:text-2xl leading-relaxed">
          CLAWS is an interdisciplinary organization at the University of Michigan. Our core
          teams—<strong className="text-white">Augmented Reality</strong>,{' '}
          <strong className="text-white">Hardware</strong>,{' '}
          <strong className="text-white">UX Design</strong>,{' '}
          <strong className="text-white">Research</strong>,{' '}
          <strong className="text-white">Infrastructure</strong>,{' '}
          <strong className="text-white">Finance</strong>,{' '}
          <strong className="text-white">Outreach</strong>,{' '}
          <strong className="text-white">Artificial Intelligence</strong>,{' '}
          <strong className="text-white">Social</strong>, and{' '}
          <strong className="text-white">Content</strong>—collaborate to design and deliver
          engineering projects that advance human and robotic exploration in space. The{' '}
          <strong className="text-white">Augmented Reality Team</strong> works across multiple
          initiatives with a primary focus on the software for NASA&apos;s SUITS challenge. The{' '}
          <strong className="text-white">Hardware Team</strong> leads physical systems design and
          prototyping efforts for NASA&apos;s RASC-AL challenge. The{' '}
          <strong className="text-white">Infrastructure Team</strong> supports web systems and data
          infrastructure while the <strong className="text-white">Research Team</strong> drives
          technical documentation and studies. The{' '}
          <strong className="text-white">UX Team</strong> collaborates across all disciplines to
          design intuitive interfaces and evaluate XR systems with an emphasis on human factors and
          astronaut usability.
        </p>
      </FadeUp>

      <div className="px-6 lg:px-10">

        {/* ══════════ OVERVIEW ══════════ */}
        <SectionDivider label="OVERVIEW" />

        <ContentPair
          className="mb-16"
          left={
            <p className="text-white/80 text-lg leading-relaxed">
              The team structure begins with the Project Manager and Technical Project Manager. They
              drive club operations on both the business and development sides. This year,
              Anirudh Annavarapu and Molly Maloney take up the mantle and continue to reinvent the
              team into more collaborative and productive systems. As the year continues, they work
              closely with subteam leads to coordinate projects for mission success.
            </p>
          }
          right={<PhotoCarousel slides={slideSets.overview.slice(0, 4)} />}
        />

        <FadeUp className="max-w-5xl mb-20 space-y-6">
          <p className="text-white/80 text-lg leading-relaxed">
            The Executive Board and Subteam Leads act as experienced members and advisors to the
            team for ongoing support throughout onboarding and development. They help bridge the gap
            between leadership and new members. Leadership drives operations and project workflow,
            with the fall focusing on onboarding and the winter focusing heavily on development. Each
            subteam has its own approach, but weekly cross-team sessions and clear handoffs—plus
            rotating highlights and shared onboarding—keep everyone aligned. Feature development
            begins in onboarding and is integrated into an MVP for winter semester.
          </p>
          <p className="text-white/80 text-lg leading-relaxed">
            The team is committed to maintaining an inclusive and diverse environment for all
            students across all disciplines. With a wide range of majors across colleges, the
            perspectives new members bring is invaluable. CLAWS frequently hosts team social events
            throughout the year, including retreats, tailgates, Friendsgiving, movie nights, CLAWS
            Olympics, Hackathons, boba trips, and more. The club has presented at several
            conferences—with more to come in the future—including the XR&nbsp;@&nbsp;Michigan
            Summit, UX@UM Conference, UMSI Convocation, and the U-M Space Symposium. The team also
            puts on several outreach events each year to teach K-12 and college students about
            science, technology, and space exploration.
          </p>
        </FadeUp>

        {/* ══════════ SUITS ══════════ */}
        <SectionDivider label="SUITS" />

        <ContentPair
          className="mb-16"
          left={<PhotoCarousel slides={slideSets.suits1} />}
          right={
            <p className="text-white/80 text-lg leading-relaxed">
              As NASA launches the Artemis program for sustained human presence on the moon and
              ultimately Mars, engineers are considering what technology will best aid astronauts to
              safely and successfully complete their missions. Today, the Mission Control Center at
              NASA relays all pertinent information to the crew via a voice loop. In the future,
              communication delays upwards of 20 minutes to the surface of Mars will require crew
              members to have more autonomy.
            </p>
          }
        />

        <ContentPair
          className="mb-16"
          left={<PhotoCarousel slides={slideSets.suits2} />}
          right={
            <p className="text-white/80 text-lg leading-relaxed">
              Stemming from NASA&apos;s foundational Joint-AR project, the NASA SUITS Challenge tasks
              university teams with developing AR interfaces for lunar astronauts, and pressurized
              rovers for assisting them. The helmet display is designed to support astronauts with
              navigation, task management, vitals tracking, geological sample logging, and
              communication between mission control and another university&apos;s rover.
            </p>
          }
        />

        <ContentPair
          className="mb-20"
          left={<PhotoCarousel slides={slideSets.suits3} />}
          right={
            <p className="text-white/80 text-lg leading-relaxed">
              At the end of each year, 10 university teams are selected as finalists from their
              written proposals. NASA scientists, engineers, designers, and astronauts evaluate the
              student-built projects, providing feedback. Past presenters have included teams from
              Stanford, Duke, USC, UC Berkeley, Carnegie Mellon, UT-Austin, Northeastern University,
              Purdue University, Columbia University, Boise State University, and many more.
            </p>
          }
        />

        {/* ══════════ RASC-AL ══════════ */}
        <SectionDivider label="RASC-AL" />

        <ContentPair
          className="mb-16"
          left={
            <p className="text-white/80 text-lg leading-relaxed">
              Long-term human presence on the Moon through the Artemis program means engineers must
              design not only individual technologies, but entire mission systems that support
              sustained surface operations. From sample return logistics to autonomous mobility and
              lunar base infrastructure, future exploration depends on scalable, integrated
              architectures that enable science, safety, and continuous operations.
            </p>
          }
          right={<PhotoCarousel slides={slideSets.rascal1} />}
        />

        <ContentPair
          className="mb-20"
          left={
            <p className="text-white/80 text-lg leading-relaxed">
              Each year, new project themes are released that designate teams to compete in specific
              areas of lunar and Martian mission design. The challenge invites university teams to
              develop forward-looking concepts that address these evolving exploration needs.
              Submissions are evaluated by NASA scientists and engineers based on technical
              feasibility, innovation, and mission impact, with top teams recognized for advancing
              future exploration concepts.
            </p>
          }
          right={<PhotoCarousel slides={slideSets.rascal2} />}
        />

        {/* ══════════ SUBTEAMS ══════════ */}
        <SectionDivider label="SUBTEAMS" />

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SubCard name="Software"  subtitle="Develop AR and Mission Control Systems"       gradient="bg-gradient-to-br from-[#3d0c0c] to-[#1a0606]" icon={Icons.software} large />
          <SubCard name="Hardware"  subtitle="Develop Robotic and Electrical Components"    gradient="bg-gradient-to-br from-[#3d2a0c] to-[#1a1206]" icon={Icons.hardware} large />
        </StaggerGrid>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <SubCard name="UX Design" subtitle="Design User Interfaces and Interaction Systems"             gradient="bg-gradient-to-br from-[#0c1a3d] to-[#060a1a]" icon={Icons.ux} />
          <SubCard name="Research"  subtitle="Investigate Mission Concepts and Emerging Technologies"     gradient="bg-gradient-to-br from-[#0c2a3d] to-[#06101a]" icon={Icons.research} />
          <SubCard name="Business"  subtitle="Manage Team Operations, Events, and Outreach"              gradient="bg-gradient-to-br from-[#0c3d1a] to-[#06150a]" icon={Icons.business} />
        </StaggerGrid>

        {/* ══════════ PROJECTS ══════════ */}
        <SectionDivider label="PROJECTS" />

        <StaggerGrid className="flex flex-col md:flex-row gap-6 mb-6">
          <FeaturedProject
            name="GEMINI"
            label="NASA SUITS 2026"
            description="Real-time lunar mission visualization for rover navigation, EVA coordination, search operations, and field repairs."
            icon={Icons.gemini}
          />
          <FeaturedProject
            name="POLARIS"
            label="NASA RASC-AL 2026"
            description="A lunar sample return architecture using modular autonomous rover configurations to search for, collect and store samples."
            icon={Icons.polaris}
          />
        </StaggerGrid>

        <StaggerGrid className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20">
          <PastProject name="AURA"  year="NASA SUITS 2025" mission="EVA Astronaut Mission" icon={Icons.aura} />
          <PastProject name="IRIS"  year="NASA SUITS 2024" mission="EVA Astronaut Mission" icon={Icons.iris} />
          <PastProject name="NOVA"  year="NASA SUITS 2023" mission="EVA Astronaut Mission" icon={Icons.nova} />
          <PastProject name="HOSHI" year="NASA SUITS 2022" mission="EVA Astronaut Mission" icon={Icons.hoshi} />
          <PastProject name="ATLAS" year="NASA SUITS 2021" mission="EVA Astronaut Mission" icon={Icons.atlas} />
        </StaggerGrid>

      </div>
    </div>
  )
}
