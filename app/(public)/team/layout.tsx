import type { Metadata } from 'next'
import { Subnav } from '@/components/layout/Subnav'

export const metadata: Metadata = { title: 'Team' }

const SUBNAV_ITEMS = [
  { label: 'Overview',      href: '/team' },
  { label: 'PM',            href: '/team/pm' },
  { label: 'Board',         href: '/team/board' },
  { label: 'Subteam Leads', href: '/team/subteam-leads' },
  { label: 'Members',       href: '/team/members' },
  { label: 'Alumni',        href: '/team/alumni' },
  { label: 'FAQ',           href: '/team/faq' },
]

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Subnav items={SUBNAV_ITEMS} />
      {children}
    </>
  )
}
