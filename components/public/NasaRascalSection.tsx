'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function NasaRascalSection() {
  return (
    <section className="bg-[#09090f] py-0">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 pb-20 sm:pb-28">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — text (appears first on mobile via order) */}
          <motion.div
            className="lg:order-1 order-2"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            <p className="text-white/28 uppercase tracking-[0.24em] text-[10.5px] font-medium mb-4">
              NASA Challenge
            </p>
            <h2
              className="font-bold text-white leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
            >
              NASA RASC-AL<br />Challenge
            </h2>
            <div className="space-y-4 text-white/52 leading-relaxed" style={{ fontSize: 'clamp(0.88rem, 1.1vw, 0.98rem)' }}>
              <p>
                New this year, CLAWS is competing in NASA&apos;s flagship mission-design challenge
                for university teams. Students develop innovative space system concepts that advance
                the infrastructure needed for sustained lunar exploration and future deep-space
                missions.
              </p>
              <p>
                For 2026, CLAWS is tackling the{' '}
                <span className="text-white font-medium">Lunar Sample Return Concept</span>{' '}
                theme — designing a scalable sample-return architecture that integrates autonomous
                rovers, pressurized surface systems, and astronaut operations.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="https://rascal.nianet.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 text-sm font-medium hover:text-white transition-colors"
              >
                Learn about RASC-AL
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT — two stacked photos */}
          <motion.div
            className="lg:order-2 order-1 flex flex-col gap-2"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
              <Image
                src="/images/gallery/juVYmX9tChfiyO6jgwUPdiBInQc.jpg"
                alt="CLAWS team working in the makerspace"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
              <Image
                src="/images/gallery/GbZnTXnbK0omF8tpwAmnwfLEn4.jpg"
                alt="Hardware team building the pressurized rover"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
