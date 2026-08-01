import { Subnav } from '@/components/layout/Subnav'
import { NavProvider } from '../nav-provider'

// Owned preview — same reasoning as Navbar.tsx: cfg.provider's single fixed
// pathname can't vary per story, so each export wraps itself in its own
// NavProvider (innermost context value wins) to get the real active state.

const ABOUT_ITEMS = [
  { label: 'Overview', href: '/about' },
  { label: 'Projects', href: '/about/projects' },
  { label: 'Subteams', href: '/about/subteams' },
  { label: 'Supporters', href: '/about/supporters' },
  { label: 'FAQ', href: '/about/faq' },
]

export const Default = () => (
  <NavProvider pathname="/about">
    <Subnav items={ABOUT_ITEMS} />
  </NavProvider>
)

export const ProjectsActive = () => (
  <NavProvider pathname="/about/projects">
    <Subnav items={ABOUT_ITEMS} />
  </NavProvider>
)
