'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

// All gallery photos with captions and layout hints (span)
const PHOTOS = [
  { src: '/images/gallery/nixIZASo9IOyHeRLJ0hXjU1I.jpg',    caption: 'Work-time with Northeastern at JSC',       wide: true  },
  { src: '/images/gallery/vgFfC72KfAAHZ5jzTrDiAGGA.jpg',    caption: 'Our UX team debriefing the evaluator',    wide: false },
  { src: '/images/gallery/pG8eCCbdXTBg2tkoIyJzlzB3B5k.jpg', caption: 'Mission Control monitoring',              wide: false },
  { src: '/images/gallery/OppfUQaiuv5mtNGDRoFfkKaxrs.jpg',  caption: 'Our evaluator at the rockyard',           wide: true  },
  { src: '/images/gallery/jqwvidnYjHIHDoMfZ6UQCC1Y.jpg',    caption: 'Engaging at the XR Summit',               wide: false },
  { src: '/images/gallery/2xCnkiC6H9rwzozMnJuK7EO3gA.jpg',  caption: 'Web team working on features',            wide: true  },
  { src: '/images/gallery/GbZnTXnbK0omF8tpwAmnwfLEn4.jpg',  caption: 'Hardware team soldering PCB',             wide: false },
  { src: '/images/gallery/i1qOgWyvNZ9HY7vivKXys8fSpo.jpg',  caption: 'Students at an outreach event',           wide: false },
]

function GalleryPhoto({
  src,
  caption,
  delay = 0,
  className = '',
}: {
  src: string
  caption: string
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl group ${className}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      <Image
        src={src}
        alt={caption}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-white/80 text-[11px] leading-tight tracking-wide">{caption}</span>
      </div>
    </motion.div>
  )
}

export function GallerySection() {
  return (
    <section className="bg-[#09090f] pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">

        {/* Section header */}
        <div className="pt-2 pb-12 sm:pb-16">
          <motion.p
            className="text-white/28 uppercase tracking-[0.24em] text-[10.5px] font-medium mb-4"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-64px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            In Focus
          </motion.p>
          <motion.h2
            className="font-bold text-white leading-[0.93] tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 5.6vw, 5.2rem)' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-64px' }}
            transition={{ duration: 0.88, ease: EASE, delay: 0.07 }}
          >
            A year in the lab,<br />the field, and the sky.
          </motion.h2>
        </div>

        {/* Row 1: [wide] [narrow] [narrow] */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <GalleryPhoto src={PHOTOS[0].src} caption={PHOTOS[0].caption} className="col-span-2 h-[260px] sm:h-[340px]" delay={0}    />
          <GalleryPhoto src={PHOTOS[1].src} caption={PHOTOS[1].caption} className="col-span-1 h-[260px] sm:h-[340px]" delay={0.08} />
        </div>

        {/* Row 2: [narrow] [wide] */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <GalleryPhoto src={PHOTOS[2].src} caption={PHOTOS[2].caption} className="col-span-1 h-[220px] sm:h-[290px]" delay={0}    />
          <GalleryPhoto src={PHOTOS[3].src} caption={PHOTOS[3].caption} className="col-span-2 h-[220px] sm:h-[290px]" delay={0.08} />
        </div>

        {/* Row 3: four equal */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PHOTOS.slice(4).map((p, i) => (
            <GalleryPhoto
              key={p.src}
              src={p.src}
              caption={p.caption}
              className="h-[180px] sm:h-[220px]"
              delay={i * 0.06}
            />
          ))}
        </div>

        <motion.p
          className="text-center text-white/20 text-xs mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Photos by Noah Feller, Jamie Zhou, Robert Markowitz, and James Blair
        </motion.p>

      </div>
    </section>
  )
}
