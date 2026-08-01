'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function NasaSuitsSection() {
  return (
    <section className="bg-[#09090f] py-0">
      {/* Full-bleed top divider */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-2 pb-20 sm:pb-28">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — photo */}
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: '4/3' }}
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Image
              src="/images/gallery/W9fCA582Pw9jY156CiO9EJ37ng.jpg"
              alt="CLAWS member wearing HoloLens at Johnson Space Center"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
          </motion.div>

          {/* RIGHT — text */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
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
              NASA SUITS<br />Challenge
            </h2>
            <div className="space-y-4 text-white/52 leading-relaxed" style={{ fontSize: 'clamp(0.88rem, 1.1vw, 0.98rem)' }}>
              <p>
                University teams from across the country are invited each year to NASA&apos;s
                Johnson Space Center in Houston, Texas, to present and test their user interfaces
                on simulated lunar or Martian terrain for researchers, designers, and ISS officials.
                Teams are challenged to create either a Pressurized Rover or an augmented reality
                display to help astronauts work safely and efficiently in space.
              </p>
              <p>
                This past May, CLAWS was 1 of 10 teams that had the opportunity to go, received
                guided feedback from experts in the field, toured restricted facilities, and welcomed
                evaluations from the ISS Flight Director and an official astronaut.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="https://www.nasa.gov/learning-resources/spacesuit-user-interface-technologies-for-students/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 text-sm font-medium hover:text-white transition-colors"
              >
                Learn about SUITS
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
