'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.88, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function Photo({
  src,
  caption,
  delay = 0,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  src: string
  caption: string
  delay?: number
  className?: string
  sizes?: string
}) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-56px' }}
      transition={{ duration: 0.88, ease: EASE, delay }}
    >
      <Image
        src={src}
        alt={caption}
        fill
        className="object-cover"
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-4 right-4 text-white/52 text-[10.5px] tracking-wide leading-tight">
        {caption}
      </span>
    </motion.div>
  )
}

function ChapterLabel({ eyebrow, title, delay = 0 }: { eyebrow: string; title: React.ReactNode; delay?: number }) {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-24 sm:pt-36 pb-10 sm:pb-14">
      <Reveal delay={delay}>
        <p className="text-white/28 uppercase tracking-[0.24em] text-[10.5px] font-medium mb-4">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={delay + 0.07}>
        <h2
          className="font-bold text-white leading-[0.93] tracking-tight"
          style={{ fontSize: 'clamp(2.6rem, 5.6vw, 5.2rem)' }}
        >
          {title}
        </h2>
      </Reveal>
    </div>
  )
}

export function TeamPhotoSection() {
  return (
    <section className="bg-[#09090f] overflow-hidden">

      {/* ── Opener — full-bleed team photo with statement ─────────────────── */}
      <div className="relative w-full" style={{ height: 'clamp(440px, 68vh, 820px)' }}>
        <Image
          src="/images/home/carousel_1/team-photo-hero.png"
          alt="CLAWS — University of Michigan"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Vignette top */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090f]/60 via-transparent to-transparent" />
        {/* Fade bottom into section bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-12 pb-12 sm:pb-20">
          <Reveal delay={0.1}>
            <p className="text-white/38 uppercase tracking-[0.24em] text-[10px] sm:text-[11px] font-medium mb-3">
              University of Michigan
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2
              className="font-bold text-white leading-[0.93] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 7vw, 6.4rem)' }}
            >
              80 students.<br />One mission.
            </h2>
          </Reveal>
        </div>
      </div>

      {/* ── Chapter 1 — Competition ────────────────────────────────────────── */}
      <ChapterLabel
        eyebrow="Competition"
        title={<>We compete where<br />it matters.</>}
      />

      {/* Competition patchwork: large JSC photo left + 2×2 grid right */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        <div className="flex flex-col md:flex-row gap-2">
          <Photo
            src="/images/home/carousel_1/DntdXvX7VKVKqcCZ4uCqWVkowWY.webp"
            caption="With NASA astronaut and officials at Johnson Space Center"
            className="md:w-[56%] h-[320px] md:h-[578px]"
            sizes="(max-width: 768px) 100vw, 56vw"
            delay={0}
          />
          <div className="md:flex-1 grid grid-cols-2 gap-2">
            <Photo
              src="/images/home/carousel_1/fPHZ5lefInlP2CV02RnlbbRmIc.png"
              caption="Apollo 15 exhibit, Space Center Houston"
              className="h-[155px] md:h-[285px]"
              delay={0.08}
            />
            <Photo
              src="/images/home/carousel_1/pp7b0bvOFYmxQMbFB0iZfprr2Q.jpg"
              caption="Tram tour of Johnson Space Center"
              className="h-[155px] md:h-[285px]"
              delay={0.13}
            />
            <Photo
              src="/images/home/carousel_1/i1qOgWyvNZ9HY7vivKXys8fSpo.jpg"
              caption="Team visit to Space Center Houston"
              className="h-[155px] md:h-[285px]"
              delay={0.18}
            />
            <Photo
              src="/images/home/carousel_1/Fvdo47eURGDfPdPr0V179N34.jpg"
              caption="JSC rockyard — the NASA water tower"
              className="h-[155px] md:h-[285px]"
              delay={0.23}
            />
          </div>
        </div>
      </div>

      {/* ── Chapter 2 — Community ─────────────────────────────────────────── */}
      <ChapterLabel
        eyebrow="Community"
        title={<>The people make<br />the mission.</>}
      />

      {/* Community patchwork */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 pb-20 sm:pb-28">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-2">
            <Photo
              src="/images/home/carousel_1/HhLG9GpYopPoaYvlHpxYjwlcWmY.png"
              caption="CLAWS Friendsgiving"
              className="md:flex-[2] h-[280px] md:h-[370px]"
              sizes="(max-width: 768px) 100vw, 66vw"
              delay={0}
            />
            <Photo
              src="/images/home/carousel_1/GihLjfXmM2n1e2LR3Zm8kIT7JM.jpg"
              caption="Boba social outing"
              className="md:flex-1 h-[240px] md:h-[370px]"
              sizes="(max-width: 768px) 100vw, 34vw"
              delay={0.1}
            />
          </div>
          <Photo
            src="/images/home/carousel_1/cKE5drnXjF9DQk6RfrT9xo9c2E.png"
            caption="Team social at Pinball Pete's in Ann Arbor"
            className="h-[200px] md:h-[240px]"
            sizes="100vw"
            delay={0.14}
          />
        </div>
      </div>

      <p className="text-center text-white/20 text-xs pb-16 px-6">
        Photos by Noah Feller, Jamie Zhou, Robert Markowitz, and James Blair
      </p>

    </section>
  )
}
