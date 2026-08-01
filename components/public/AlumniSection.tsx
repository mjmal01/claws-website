'use client'

import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const COMPANIES = [
  'NASA',
  'SpaceX',
  'Lockheed Martin',
  'RTX',
  'BAE Systems',
  'Siemens',
  'Capital One',
  'Qualcomm',
  'Roblox',
  'Amazon',
  'Coinbase',
  'Stripe',
  'Walmart',
  'Expedia',
  'University of Michigan',
]

export function AlumniSection() {
  return (
    <section className="bg-[#09090f] pb-28 sm:pb-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">

        {/* Section header */}
        <div className="pt-2 pb-14 sm:pb-18">
          <motion.p
            className="text-white/28 uppercase tracking-[0.24em] text-[10.5px] font-medium mb-4"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-64px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Alumni
          </motion.p>
          <motion.h2
            className="font-bold text-white leading-[0.93] tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 5.6vw, 5.2rem)' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-64px' }}
            transition={{ duration: 0.88, ease: EASE, delay: 0.07 }}
          >
            Where our<br />alumni go.
          </motion.h2>
          <motion.p
            className="text-white/38 mt-5 leading-relaxed"
            style={{ fontSize: 'clamp(0.88rem, 1.1vw, 0.98rem)', maxWidth: '34rem' }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-64px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          >
            CLAWS alumni go on to build careers at the world's leading aerospace,
            technology, and research organizations.
          </motion.p>
        </div>

        {/* Company grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.06]">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company}
              className="flex items-center justify-center px-4 py-7 bg-[#09090f] text-white/40 text-sm font-medium tracking-wide text-center hover:text-white/75 hover:bg-white/[0.03] transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-48px' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}
            >
              {company}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
