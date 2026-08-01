import type { Metadata } from 'next'
import { Subnav } from '@/components/layout/Subnav'

export const metadata: Metadata = { title: 'Join' }

const SUBNAV_ITEMS = [
  { label: 'Overview', href: '/join' },
  { label: 'Apply',    href: '/join/apply' },
  { label: 'Contact',  href: '/join/contact' },
  { label: 'FAQ',      href: '/join/faq' },
]

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Subnav items={SUBNAV_ITEMS} />
      {children}
    </>
  )
}
