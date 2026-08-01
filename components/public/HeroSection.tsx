'use client'

import Image from 'next/image'

// Deterministic star positions using a seeded formula
function getStars(count: number) {
  const stars = []
  for (let i = 0; i < count; i++) {
    const x = ((i * 2654435761) % 10000) / 100
    const y = ((i * 1234567891) % 10000) / 100
    const size = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1
    const opacity = 0.4 + ((i * 7) % 40) / 100
    stars.push({ x, y, size, opacity })
  }
  return stars
}

const stars = getStars(150)

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Starfield */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              left: star.x + '%',
              top: star.y + '%',
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Two-column layout */}
      <div className="relative w-full h-full grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT column */}
        <div className="flex flex-col justify-end px-6 lg:px-16 pt-32 pb-16 lg:pt-0 lg:pb-24 lg:h-screen">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tight">
            Design Space Systems
            <br />
            for Human Exploration
          </h1>
          <p className="text-white/65 text-lg mt-6 leading-relaxed">
            The Collaborative Lab for Advancing Work in Space
          </p>
          <p className="text-white/65 text-lg leading-relaxed">
            2026 NASA SUITS &amp; RASC-AL Challenges
          </p>
        </div>

        {/* RIGHT column: astronaut */}
        <div className="relative flex items-center justify-center h-64 lg:h-screen">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)',
            }}
          />
          <div className="relative w-full h-full max-h-screen">
            <Image
              src="/images/home/O6QVdpceCOUU4GSuSr6tlJUq7ao.avif"
              alt="Astronaut in spacesuit"
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
