'use client'

import Image from 'next/image'

// Brand palette:
//   Software  #873D3D  → variants: AR / AI / Infrastructure
//   Hardware  #C79F5A
//   UX Design #38407A
//   Research  #28706E
//   Business  #669667  → variants: Outreach / Content / Social / Finance

const WHITE_SHADOW = '0 0 0 1px rgba(255,255,255,0.12), 0 8px 52px rgba(255,255,255,0.22), 0 2px 20px rgba(255,255,255,0.10)'

const teams: {
  name: string
  description: string
  icon: string
  bg: string
  borderColor: string
  hoverShadow: string
}[] = [
  {
    name: 'Augmented Reality',
    description: 'Develop AR Mission Software and Peripherals',
    icon: 'ar.png',
    bg: 'radial-gradient(ellipse at top left, rgba(155,58,58,1) 0%, rgba(120,44,44,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(135,61,61,0.45)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Artificial Intelligence',
    description: 'Develop Autonomous and Intelligent Systems',
    icon: 'ai.avif',
    bg: 'radial-gradient(ellipse at top right, rgba(148,52,65,1) 0%, rgba(115,40,52,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(135,61,61,0.4)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Infrastructure',
    description: 'Develop Web Systems for AR and Peripherals',
    icon: 'infrastructure.png',
    bg: 'radial-gradient(ellipse at bottom left, rgba(122,48,58,1) 0%, rgba(95,36,46,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(135,61,61,0.35)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'UX Design',
    description: 'Design User Interfaces and Interaction Systems',
    icon: 'ux-design.png',
    bg: 'radial-gradient(ellipse at bottom left, rgba(56,64,122,1) 0%, rgba(42,50,100,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(56,64,122,0.55)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Hardware',
    description: 'Develop Robotic and Electrical Components',
    icon: 'hardware.avif',
    bg: 'radial-gradient(ellipse at top right, rgba(199,159,90,1) 0%, rgba(160,124,65,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(199,159,90,0.5)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Research',
    description: 'Investigate Mission Concepts and Emerging Technologies',
    icon: 'research.png',
    bg: 'radial-gradient(ellipse at center, rgba(40,112,110,1) 0%, rgba(28,86,84,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(40,112,110,0.55)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Outreach',
    description: 'Coordinate Events and Community Initiatives',
    icon: 'outreach.png',
    bg: 'radial-gradient(ellipse at bottom right, rgba(102,150,103,1) 0%, rgba(76,118,78,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(102,150,103,0.5)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Content',
    description: 'Produce Media and Manage Social Platforms',
    icon: 'content.avif',
    bg: 'radial-gradient(ellipse at top left, rgba(88,136,90,1) 0%, rgba(66,108,68,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(102,150,103,0.45)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Social',
    description: 'Plan and Arrange Team Events',
    icon: 'social.avif',
    bg: 'radial-gradient(ellipse at top right, rgba(78,122,80,1) 0%, rgba(58,96,60,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(102,150,103,0.38)',
    hoverShadow: WHITE_SHADOW,
  },
  {
    name: 'Finance',
    description: 'Manage Team Finances and Funding',
    icon: 'finance.avif',
    bg: 'radial-gradient(ellipse at bottom left, rgba(68,108,70,1) 0%, rgba(50,82,52,0.5) 42%, #09090f 72%)',
    borderColor: 'rgba(102,150,103,0.32)',
    hoverShadow: WHITE_SHADOW,
  },
]

const row1 = teams.slice(0, 5)  // AR · AI · Infrastructure · UX · Hardware
const row2 = teams.slice(5)     // Research · Outreach · Content · Social · Finance

function TeamCard({ team }: { team: typeof teams[0] }) {
  return (
    <div
      className="team-card w-60 flex-shrink-0 rounded-xl p-5 mx-3 cursor-default border"
      style={{
        background: team.bg,
        borderColor: team.borderColor,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = team.hoverShadow
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.25)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = team.borderColor
      }}
    >
      <div className="team-icon relative w-10 h-10 mb-4">
        <Image
          src={`/images/icons/${team.icon}`}
          alt={team.name}
          fill
          className="object-contain"
          sizes="40px"
        />
      </div>
      <h3 className="text-white font-bold text-sm mb-1.5 leading-snug">
        {team.name}
      </h3>
      <p className="text-white/50 text-xs leading-snug">
        {team.description}
      </p>
    </div>
  )
}

export function TeamCardsSection() {
  const doubled1 = [...row1, ...row1]
  const doubled2 = [...row2, ...row2]

  return (
    <section className="py-6 bg-black overflow-hidden space-y-4">
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes iconWiggle {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-15deg); }
          45%  { transform: rotate(18deg); }
          65%  { transform: rotate(-10deg); }
          80%  { transform: rotate(7deg); }
          92%  { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }
        .marquee-row { display: flex; }
        .marquee-row:hover > .marquee-inner { animation-play-state: paused; }
        .marquee-inner-left {
          display: flex;
          animation: marquee-left 18s linear infinite;
        }
        .marquee-inner-right {
          display: flex;
          animation: marquee-right 18s linear infinite;
        }
        .team-card {
          transition: transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 350ms ease-out,
                      border-color 350ms ease-out;
        }
        .team-card:hover {
          transform: translateY(-10px) scale(1.07);
        }
        .team-icon {
          transform-origin: center center;
        }
        .team-card:hover .team-icon {
          animation: iconWiggle 0.65s ease-in-out forwards;
        }
      `}</style>

      {/* Row 1 — scrolls left */}
      <div className="marquee-row">
        <div className="marquee-inner marquee-inner-left">
          {doubled1.map((team, i) => (
            <TeamCard key={i} team={team} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-row">
        <div className="marquee-inner marquee-inner-right">
          {doubled2.map((team, i) => (
            <TeamCard key={i} team={team} />
          ))}
        </div>
      </div>
    </section>
  )
}
