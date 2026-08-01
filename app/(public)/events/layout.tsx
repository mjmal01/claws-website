import type { Metadata } from 'next'
import { Subnav } from '@/components/layout/Subnav'

export const metadata: Metadata = { title: 'Events' }

const SUBNAV_ITEMS = [
  { label: 'Overview',  href: '/events' },
  { label: 'News',      href: '/events/news' },
  { label: 'Community', href: '/events/community' },
]

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Subnav items={SUBNAV_ITEMS} />
      {children}
    </>
  )
}
