'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion, useScroll, useTransform,
  useMotionValue, useSpring, useMotionTemplate, animate,
} from 'framer-motion'

// ── Stars — 4 size tiers, ~20 % twinkle ──────────────────────────────────────
function buildStars(count: number) {
  const out = []
  for (let i = 0; i < count; i++) {
    const x      = ((i * 2654435761) % 10000) / 100
    const y      = ((i * 1234567891) % 10000) / 100
    const size   = i % 22 === 0 ? 4 : i % 6 === 0 ? 3 : i % 3 === 0 ? 2 : 1
    const op     = 0.22 + ((i * 7) % 52) / 100
    const twinkle = i % 5 === 0
    const tDelay  = (i % 32) / 6
    const tDur    = 2 + (i % 4)
    out.push({ x, y, size, op, twinkle, tDelay, tDur })
  }
  return out
}
const STARS = buildStars(260)

// ── Subteam data (brand palette) ─────────────────────────────────────────────
const SUBTEAMS = [
  {
    name: 'Augmented Reality', group: 'Software',
    description: 'Building the AR mission software and hardware peripherals astronauts use in the field during NASA SUITS challenges.',
    icon: '/images/icons/ar.png',
    bg:     'radial-gradient(ellipse at 38% 22%, rgba(155,58,58,1) 0%, rgba(120,44,44,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(135,61,61,0.55)', glow: 'rgba(135,61,61,0.42)', accent: '#e07878',
  },
  {
    name: 'Artificial Intelligence', group: 'Software',
    description: 'Developing autonomous systems and intelligent algorithms that power real-time decision-making for mission operations.',
    icon: '/images/icons/ai.avif',
    bg:     'radial-gradient(ellipse at 65% 28%, rgba(148,52,65,1) 0%, rgba(115,40,52,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(135,61,61,0.5)', glow: 'rgba(148,52,65,0.42)', accent: '#d46878',
  },
  {
    name: 'Infrastructure', group: 'Software',
    description: 'Engineering the web systems, databases, and backend architecture that connect all of our software components.',
    icon: '/images/icons/infrastructure.png',
    bg:     'radial-gradient(ellipse at 28% 55%, rgba(122,48,58,1) 0%, rgba(95,36,46,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(135,61,61,0.45)', glow: 'rgba(122,48,58,0.42)', accent: '#c46070',
  },
  {
    name: 'UX Design', group: 'Design',
    description: 'Creating intuitive astronaut-facing interfaces that are clear and efficient under the pressure of a live mission.',
    icon: '/images/icons/ux-design.png',
    bg:     'radial-gradient(ellipse at 55% 25%, rgba(56,64,122,1) 0%, rgba(42,50,100,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(56,64,122,0.6)', glow: 'rgba(56,64,122,0.44)', accent: '#7888d8',
  },
  {
    name: 'Hardware', group: 'Engineering',
    description: 'Designing and fabricating physical robotic systems, electronics, and custom peripherals used in our missions.',
    icon: '/images/icons/hardware.avif',
    bg:     'radial-gradient(ellipse at 42% 30%, rgba(199,159,90,1) 0%, rgba(160,124,65,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(199,159,90,0.55)', glow: 'rgba(199,159,90,0.42)', accent: '#d8b878',
  },
  {
    name: 'Research', group: 'Science',
    description: 'Investigating emerging space technologies, mission architectures, and human-factors research to drive our technical roadmap.',
    icon: '/images/icons/research.png',
    bg:     'radial-gradient(ellipse at 35% 32%, rgba(40,112,110,1) 0%, rgba(28,86,84,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(40,112,110,0.6)', glow: 'rgba(40,112,110,0.44)', accent: '#44c4c0',
  },
  {
    name: 'Outreach', group: 'Business',
    description: "Organizing community events, STEM education initiatives, and partnerships that expand CLAWS's reach beyond campus.",
    icon: '/images/icons/outreach.png',
    bg:     'radial-gradient(ellipse at 60% 26%, rgba(102,150,103,1) 0%, rgba(76,118,78,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(102,150,103,0.55)', glow: 'rgba(102,150,103,0.42)', accent: '#8ed090',
  },
  {
    name: 'Content', group: 'Business',
    description: 'Producing videos, photography, and written media that share our work with the world and build the CLAWS brand.',
    icon: '/images/icons/content.avif',
    bg:     'radial-gradient(ellipse at 32% 38%, rgba(88,136,90,1) 0%, rgba(66,108,68,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(102,150,103,0.5)', glow: 'rgba(88,136,90,0.42)', accent: '#7ac07c',
  },
  {
    name: 'Social', group: 'Business',
    description: 'Curating our social media presence and planning team events that strengthen culture and keep everyone connected.',
    icon: '/images/icons/social.avif',
    bg:     'radial-gradient(ellipse at 50% 20%, rgba(78,122,80,1) 0%, rgba(58,96,60,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(102,150,103,0.45)', glow: 'rgba(78,122,80,0.42)', accent: '#6cb070',
  },
  {
    name: 'Finance', group: 'Business',
    description: 'Managing budgets, securing grants, and building sponsor relationships that fund our missions and keep CLAWS running.',
    icon: '/images/icons/finance.avif',
    bg:     'radial-gradient(ellipse at 45% 55%, rgba(68,108,70,1) 0%, rgba(50,82,52,0.55) 42%, rgba(9,9,15,1) 72%)',
    border: 'rgba(102,150,103,0.4)', glow: 'rgba(68,108,70,0.42)', accent: '#60a464',
  },
]

// ── 3-D carousel slot transforms ─────────────────────────────────────────────
const CARD_W = 260
const CARD_H = 398

function slotTransform(pos: number) {
  const s = Math.sign(pos), a = Math.abs(pos)
  if (a === 0) return { x: 0,        ry: 0,      sc: 1,    op: 1,    z: 0    }
  if (a === 1) return { x: s * 210,  ry: s * 50, sc: 0.76, op: 0.48, z: -85  }
  if (a === 2) return { x: s * 355,  ry: s * 66, sc: 0.56, op: 0.13, z: -165 }
  return               { x: s * 445, ry: s * 75, sc: 0.44, op: 0,    z: -220 }
}

// ── Scroll keyframes ──────────────────────────────────────────────────────────
const HX0 = 0.00; const HX1 = 0.11          // hero text exit
const CI0 = 0.09; const CI1 = 0.17           // cards fade in
const CE0 = 0.63; const CE1 = 0.76           // cards fade out
const AE0 = 0.61; const AE1 = 0.79           // astronaut exit left
const TX0 = 0.66; const TX1 = 0.88           // title enters (overlaps card exit)
const DX0 = 0.72; const DX1 = 0.93           // desc enters (delayed)
const N = SUBTEAMS.length

export function HeroRolodexSection() {
  const ref                           = useRef<HTMLDivElement>(null)
  const [idx,      setIdx]            = useState(0)
  const [phase,    setPhase]          = useState<'hero' | 'cards' | 'text'>('hero')
  const [grabbing, setGrabbing]       = useState(false)
  const isDragging                    = useRef(false)
  const dragStartX                    = useRef(0)

  // ── Mouse-tracking spotlight (like old site) ──────────────────────────────
  // Start far off-screen so the gradient is invisible until the mouse moves
  const rawX = useMotionValue(-2000)
  const rawY = useMotionValue(-2000)
  const smX  = useSpring(rawX, { stiffness: 90, damping: 28, mass: 0.4 })
  const smY  = useSpring(rawY, { stiffness: 90, damping: 28, mass: 0.4 })
  const spotlight = useMotionTemplate`radial-gradient(680px circle at ${smX}px ${smY}px, rgba(255,255,255,0.045) 0%, transparent 65%)`

  // ── Pointer-drag for astronaut (native pointer events — no FM drag) ───────
  const dragX      = useMotionValue(0)
  const dragGlow   = useTransform(dragX, [-95, 0], [1, 0])
  const skippedRef = useRef(false)

  // ── Phase-3 motion values — driven by scroll OR by skip animation ─────────
  const logoY   = useMotionValue(-120)
  const logoOp  = useMotionValue(0)
  const titleY  = useMotionValue(90)
  const titleOp = useMotionValue(0)
  const descY   = useMotionValue(70)
  const descOp  = useMotionValue(0)

  const handleSkip = async () => {
    const el = ref.current
    if (!el) return

    // 1. Fly astronaut off to the left
    await animate(dragX, -window.innerWidth * 2.2, {
      duration: 0.36,
      ease: [0.4, 0, 1, 1],
    })
    dragX.set(0)

    // 2. Lock scroll-driver out; set phase immediately
    skippedRef.current = true
    setPhase('text')

    // 3. Animate logo from top, title+desc from bottom, staggered
    const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
    animate(logoY,   0, { duration: 0.75, ease })
    animate(logoOp,  1, { duration: 0.55, ease: 'easeOut' })
    animate(titleY,  0, { duration: 0.75, ease, delay: 0.12 })
    animate(titleOp, 1, { duration: 0.55, ease: 'easeOut', delay: 0.12 })
    animate(descY,   0, { duration: 0.75, ease, delay: 0.24 })
    animate(descOp,  1, { duration: 0.55, ease: 'easeOut', delay: 0.24 })

    // 4. Glide to the end of the sticky section so it unsticks
    window.scrollTo({ top: el.offsetTop + el.offsetHeight * 0.92, behavior: 'smooth' })
  }

  const onPtrDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 'cards') return
    isDragging.current = true
    dragStartX.current = e.clientX
    setGrabbing(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPtrMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    dragX.set(Math.min(30, Math.max(-700, e.clientX - dragStartX.current)))
  }
  const onPtrUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    isDragging.current = false
    setGrabbing(false)
    const delta = e.clientX - dragStartX.current
    if (delta < -95) {
      handleSkip()
    } else {
      animate(dragX, 0, { type: 'spring', stiffness: 380, damping: 32 })
    }
  }

  // ── Scroll-driven transforms ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const heroY      = useTransform(scrollYProgress, [HX0, HX1],           ['0%', '-115%'])
  const heroOp     = useTransform(scrollYProgress, [HX0, HX1 * 0.55],    [1, 0])
  const cardsOp    = useTransform(scrollYProgress, [CI0, CI1, CE0, CE1], [0, 1, 1, 0])
  const cardsX     = useTransform(scrollYProgress, [CE0, CE1],            [0, -48])
  const glowOp     = useTransform(scrollYProgress, [CI0, CI1, CE0, CE1], [0, 1, 1, 0])
  const astronautX = useTransform(scrollYProgress, [0, AE0, AE1],        ['0%', '0%', '-185%'])

  // Helper: clamp a value to [0, 1] range
  const clamp01 = (t: number) => Math.max(0, Math.min(1, t))

  useEffect(() => {
    return scrollYProgress.on('change', v => {
      // After skip, lock the scroll driver out entirely — don't let it revert phase
      if (skippedRef.current) return

      if (v < CI0)      setPhase('hero')
      else if (v < CE1) setPhase('cards')
      else              setPhase('text')
      if (v >= CI1) setIdx(Math.min(Math.floor(((v - CI1) / (CE0 - CI1)) * N), N - 1))

      const tTX = clamp01((v - TX0) / (TX1 - TX0))
      const tDX = clamp01((v - DX0) / (DX1 - DX0))
      logoY.set(-120 + tTX * 120)
      logoOp.set(tTX)
      titleY.set(90 - tTX * 90)
      titleOp.set(tTX)
      descY.set(70 - tDX * 70)
      descOp.set(tDX)
    })
  }, [scrollYProgress, logoY, logoOp, titleY, titleOp, descY, descOp])

  const team = SUBTEAMS[idx]

  return (
    <div ref={ref} className="relative" style={{ height: '880vh' }}>

      {/* ── Sticky canvas ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 h-screen overflow-hidden bg-[#09090f]"
        onMouseMove={e => { rawX.set(e.clientX); rawY.set(e.clientY) }}
      >
        {/* Twinkle keyframe */}
        <style>{`
          @keyframes twinkle {
            0%,100% { opacity: var(--op); }
            50%     { opacity: calc(var(--op) * 0.12); }
          }
        `}</style>

        {/* Stars */}
        <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width:  s.size,
                height: s.size,
                left:   `${s.x}%`,
                top:    `${s.y}%`,
                opacity: s.op,
                ['--op' as string]: s.op,
                ...(s.twinkle ? {
                  animation: `twinkle ${s.tDur}s ${s.tDelay}s ease-in-out infinite`,
                } : {}),
              }}
            />
          ))}
        </div>

        {/* Mouse spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: spotlight }}
        />

        {/* Subteam ambient glow */}
        <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: glowOp }}>
          <motion.div
            className="absolute inset-0"
            animate={{ background: `radial-gradient(ellipse at 62% 90%, ${team.glow} 0%, transparent 46%)` }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </motion.div>

        {/* ── Nebula behind astronaut ──────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{
          background: [
            'radial-gradient(ellipse 38% 44% at 70% 88%, rgba(55,30,85,0.52) 0%, transparent 100%)',
            'radial-gradient(ellipse 30% 36% at 82% 42%, rgba(25,15,55,0.32) 0%, transparent 100%)',
            'radial-gradient(ellipse 26% 32% at 56% 60%, rgba(20,40,70,0.22) 0%, transparent 100%)',
          ].join(', '),
        }} />

        {/* ── Astronaut ───────────────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-0 z-20"
          style={{ right: 0, width: '54%', height: '100%', x: astronautX }}
        >
          {/* Atmospheric gradient ON TOP of astronaut — top/bottom only, no left-edge line */}
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            background: [
              'linear-gradient(to bottom, rgba(9,9,15,0.55) 0%, transparent 20%)',
              'linear-gradient(to top,    rgba(9,9,15,0.92) 0%, transparent 30%)',
            ].join(', '),
          }} />

          {/* Astronaut image + drag-offset visual (pointer-events-none — events handled by z-40 overlay) */}
          <motion.div
            className="absolute inset-0 pointer-events-none select-none"
            style={{ x: dragX }}
          >
            <Image
              src="/images/home/O6QVdpceCOUU4GSuSr6tlJUq7ao.avif"
              alt="Astronaut in spacesuit"
              fill
              className="object-contain object-bottom"
              priority
              sizes="54vw"
              draggable={false}
            />

            {/* Drag-progress brightening */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 42% 52%, rgba(255,255,255,0.09) 0%, transparent 58%)',
                opacity: dragGlow,
              }}
            />
          </motion.div>

          {/* Hint pill — visual only, sits above astronaut image */}
          <motion.div
            className="absolute pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-sm z-30"
            style={{ bottom: '36%', left: '50%', translateX: '-50%', whiteSpace: 'nowrap' }}
            animate={{ opacity: phase === 'cards' ? 0.65 : 0, y: phase === 'cards' ? 0 : 8 }}
            transition={{ duration: 0.4, delay: phase === 'cards' ? 0.9 : 0 }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
              <path d="M8 5.5H3M5 3L2.5 5.5 5 8" stroke="white" strokeWidth="1.35"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white/80 text-[11px] font-medium tracking-wide">drag to skip</span>
          </motion.div>
        </motion.div>

        {/* ── Phase 1 · Hero text ──────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-30 flex items-end pb-24 lg:items-center lg:pb-0"
          style={{ paddingLeft: 'clamp(2rem, 7vw, 6rem)', y: heroY, opacity: heroOp }}
        >
          <div style={{ maxWidth: '40rem' }}>
            <p className="text-white/38 uppercase tracking-[0.22em] text-[11px] mb-5 font-medium">
              University of Michigan
            </p>
            <h1 className="font-bold text-white leading-[0.94] tracking-tight"
              style={{ fontSize: 'clamp(2.6rem, 5.4vw, 4.4rem)' }}>
              Design Space Systems<br />for Human Exploration
            </h1>
            <p className="text-white/55 mt-5 leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.35vw, 1.12rem)' }}>
              The Collaborative Lab for Advancing Work in Space
            </p>
            <p className="text-white/28 mt-1.5 text-sm">2026 NASA SUITS &amp; RASC-AL Challenges</p>
            <div className="mt-9 flex items-center gap-3 flex-wrap">
              <Link href="/join/apply"
                className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/90 transition-colors">
                Apply Now
              </Link>
              <Link href="/about"
                className="px-5 py-2.5 border border-white/22 text-white text-sm rounded-full hover:border-white/45 transition-colors">
                Learn More
              </Link>
            </div>
            <motion.div
              className="mt-14 flex items-center gap-2.5 text-white/26 text-xs select-none"
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.3, ease: 'easeInOut' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Scroll to explore our teams
            </motion.div>
          </div>
        </motion.div>

        {/* ── Phase 2 · Carousel ───────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-center"
          style={{ paddingLeft: 'clamp(2rem, 16vw, 14rem)', opacity: cardsOp, x: cardsX }}
          aria-hidden={phase !== 'cards'}
        >
          <div className="flex items-center gap-3 mb-6">
            <p className="text-white/36 uppercase tracking-[0.22em] text-[11px] font-medium">Our Subteams</p>
            <span className="text-white/18 text-[11px] tabular-nums">{idx + 1} / {N}</span>
          </div>

          <div className="flex gap-1.5 mb-10 items-center">
            {SUBTEAMS.map((_, i) => (
              <motion.div key={i} className="h-[3px] rounded-full bg-white"
                animate={{ width: i === idx ? 26 : 8, opacity: i === idx ? 1 : 0.15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }} />
            ))}
          </div>

          <div className="relative" style={{ height: CARD_H, perspective: '1000px', perspectiveOrigin: '0% 50%' }}>
            <div className="absolute top-0 left-0 h-full" style={{ width: 0 }}>
              {SUBTEAMS.map((t, i) => {
                const pos      = i - idx
                const tr       = slotTransform(pos)
                const isCenter = pos === 0
                return (
                  <motion.div key={i}
                    className="absolute top-0 rounded-2xl border overflow-hidden group"
                    style={{
                      width: CARD_W, height: CARD_H,
                      marginLeft: -(CARD_W / 2),
                      background: t.bg, borderColor: t.border,
                      transformStyle: 'preserve-3d',
                      zIndex: isCenter ? 15 : Math.max(1, 10 - Math.abs(pos) * 3),
                      pointerEvents: isCenter ? 'auto' : 'none',
                    }}
                    animate={{ x: tr.x, rotateY: tr.ry, scale: tr.sc, opacity: tr.op, z: tr.z }}
                    whileHover={isCenter ? {
                      scale: 1.038,
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.14), 0 8px 52px rgba(255,255,255,0.22), 0 2px 20px rgba(255,255,255,0.10)',
                    } : {}}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], scale: { duration: 0.22 } }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                      style={{ boxShadow: 'inset 0 0 40px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.12)' }} />

                    <div className="relative z-10 flex flex-col h-full p-6">
                      <div className="relative mb-4" style={{ width: 60, height: 60 }}>
                        <Image src={t.icon} alt={t.name} fill className="object-contain" sizes="60px" />
                      </div>
                      <span className="self-start text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border mb-4"
                        style={{ color: t.accent, borderColor: t.border, background: 'rgba(0,0,0,0.45)' }}>
                        {t.group}
                      </span>
                      <h2 className="text-white font-bold leading-tight tracking-tight mb-2.5"
                        style={{ fontSize: 'clamp(1.15rem, 1.55vw, 1.4rem)' }}>
                        {t.name}
                      </h2>
                      <p className="text-white/48 text-[12.5px] leading-relaxed line-clamp-4 flex-1">
                        {t.description}
                      </p>
                      <div className="mt-4 pt-4 flex items-center justify-between"
                        style={{ borderTop: `1px solid ${t.border}` }}>
                        <div className="flex gap-1 items-center">
                          {Array.from({ length: N }).map((_, di) => (
                            <motion.div key={di} className="rounded-full"
                              animate={{ width: di === i ? 7 : 3, height: 3,
                                backgroundColor: di === i ? t.accent : 'rgba(255,255,255,0.18)' }}
                              transition={{ duration: 0.28 }} />
                          ))}
                        </div>
                        <Link href="/about/subteams" tabIndex={isCenter ? 0 : -1}
                          className="flex items-center gap-1 text-[11px] font-medium hover:opacity-70 transition-opacity"
                          style={{ color: t.accent }}>
                          Explore
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4"
                              strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <motion.p className="mt-7 flex items-center gap-2 text-white/20 text-[11px] select-none"
            animate={{ opacity: [0.35, 0.72, 0.35] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
            <span>↓</span>
            {idx < N - 1 ? `Next: ${SUBTEAMS[idx + 1].name}` : 'Scroll to continue'}
          </motion.p>
        </motion.div>

        {/* ── Phase 3 · Logo LEFT panel + title/desc RIGHT ─────────────────── */}
        <div
          className="absolute inset-0 z-30 grid"
          style={{
            gridTemplateColumns: '42% 1fr',
            pointerEvents: phase === 'text' ? 'auto' : 'none',
          }}
          aria-hidden={phase !== 'text'}
        >
          {/* LEFT — logo fills the panel */}
          <div className="flex items-center justify-center">
            <motion.div
              className="relative"
              style={{ width: 'clamp(180px, 22vw, 300px)', aspectRatio: '1', y: logoY, opacity: logoOp }}
            >
              <Image
                src="/images/home/CLAWS Logo SVG.png"
                alt="CLAWS"
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 22vw, 300px"
              />
            </motion.div>
          </div>

          {/* RIGHT — title + description */}
          <div className="flex flex-col justify-center pr-12"
            style={{ paddingRight: 'clamp(2rem, 6vw, 5rem)' }}>
            <motion.div style={{ y: titleY, opacity: titleOp }}>
              <p className="text-white/35 uppercase tracking-[0.22em] text-[11px] mb-4 font-medium">
                About CLAWS
              </p>
              <h2 className="font-bold text-white leading-[1.0] tracking-tight"
                style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.9rem)' }}>
                The Collaborative Lab<br />
                for Advancing Work<br />
                in Space
              </h2>
            </motion.div>

            <motion.div style={{ y: descY, opacity: descOp }} className="mt-6">
              <p className="text-white/50 leading-relaxed"
                style={{ fontSize: 'clamp(0.85rem, 1.15vw, 0.98rem)', maxWidth: '34rem' }}>
                CLAWS is an interdisciplinary engineering organization at the University of
                Michigan. We design software, hardware, and mission systems for human space
                exploration — competing in NASA&apos;s SUITS and RASC-AL challenges to push
                the boundaries of what student engineers can build.
              </p>
              <div className="mt-7 flex items-center gap-3 flex-wrap">
                <Link href="/about"
                  className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/90 transition-colors">
                  Our Story
                </Link>
                <Link href="/join/apply"
                  className="px-5 py-2.5 border border-white/22 text-white text-sm rounded-full hover:border-white/45 transition-colors">
                  Join the Team
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Drag overlay — z-40, above carousel, handles skip gesture ─────── */}
        <div
          className={[
            'absolute inset-0 z-40 select-none',
            phase === 'cards'
              ? grabbing ? 'cursor-grabbing' : 'cursor-grab'
              : 'pointer-events-none',
          ].join(' ')}
          onPointerDown={onPtrDown}
          onPointerMove={onPtrMove}
          onPointerUp={onPtrUp}
          onPointerCancel={onPtrUp}
        />

      </div>
    </div>
  )
}
