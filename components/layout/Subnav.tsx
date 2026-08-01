'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SubnavItem {
  label: string
  href: string
}

interface SubnavProps {
  items: SubnavItem[]
}

export function Subnav({ items }: SubnavProps) {
  const pathname = usePathname()

  return (
    <div className="sticky top-16 z-30 border-b border-white-10 bg-space/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 overflow-x-auto no-scrollbar py-1">
          {items.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                  active
                    ? 'text-white bg-white-10'
                    : 'text-white-50 hover:text-white hover:bg-white-10',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
