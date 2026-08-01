'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import type { Member, Subteam } from '@/lib/supabase'

interface PortalNavProps {
  member: Member
  subteamData: Subteam | null
  unreadCount: number
}

const NAV_LINKS = [
  { label: 'Home',     href: '/members' },
  { label: 'Messages', href: '/members/messages' },
  { label: 'Tasks',    href: '/members/tasks' },
  { label: 'Merch',    href: '/members/merch' },
  { label: 'Help',     href: '/members/help' },
  { label: 'News',     href: '/members/news' },
]

export function PortalNav({ member, subteamData, unreadCount }: PortalNavProps) {
  const pathname = usePathname()

  const isSubteamLead = subteamData?.lead_id === member.id
  const canManage = member.role === 'leadership' || member.role === 'faculty' || isSubteamLead

  function isActive(href: string) {
    if (href === '/members') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-white-10 bg-space/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 h-16">
        <Link href="/members/profile" className="flex-shrink-0">
          <Avatar src={member.avatar_url} name={member.name} size="sm" />
        </Link>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                isActive(href)
                  ? 'text-white bg-white-10'
                  : 'text-white-50 hover:text-white hover:bg-white-10',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}

          {canManage && (
            <Link
              href="/members/manage"
              className={[
                'px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors border',
                isActive('/members/manage')
                  ? 'text-maize bg-maize-muted border-maize/30'
                  : 'text-maize/70 hover:text-maize hover:bg-maize-muted border-transparent hover:border-maize/20',
              ].join(' ')}
            >
              Manage
            </Link>
          )}
        </div>

        <Link href="/members/notifications" className="relative flex-shrink-0 p-2 text-white-50 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-maize text-space text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
