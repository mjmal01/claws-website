'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Home',   href: '/' },
  { label: 'About',  href: '/about' },
  { label: 'Team',   href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Join',   href: '/join' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black">
      <div className="w-full px-6 lg:px-10 flex items-center justify-between h-16">
        {/* LEFT: UM Block M + CLAWS wordmark */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-maize text-black font-black text-sm leading-none select-none">
            M
          </span>
          <span className="font-bold text-white text-xl tracking-tight">
            CLA<span className="text-white/80">))</span>S
          </span>
        </Link>

        {/* CENTER: Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                'text-sm transition-colors',
                isActive(href)
                  ? 'text-white font-semibold'
                  : 'text-white/65 hover:text-white',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT: MaizePages link + Member Portal button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://maizepages.umich.edu/organization/claws"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/65 hover:text-white transition-colors"
          >
            MaizePages
          </a>
          <Link
            href="/members"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-claws-blue text-white hover:bg-claws-blue-light transition-colors"
          >
            Member Portal
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={[
                'text-sm py-2 transition-colors',
                isActive(href)
                  ? 'text-white font-semibold'
                  : 'text-white/65',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://maizepages.umich.edu/organization/claws"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/65 py-2"
          >
            MaizePages
          </a>
          <Link
            href="/members"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold bg-claws-blue text-white text-center"
          >
            Member Portal
          </Link>
        </div>
      )}
    </nav>
  )
}
