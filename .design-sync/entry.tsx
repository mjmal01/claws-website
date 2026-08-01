// Claude Design sync entry — re-exports the components meant to be
// remixed/built-with by a design agent. Full scope per the maintainer:
// primitives (ui), public marketing page sections + shared layout (public
// pages are the priority — most Figma-import + prompting design work
// happens there, and they set the shared visual language the portal
// inherits), and the real member-portal client components
// (app/members/**/*Client.tsx). Excludes:
//   - components/portal/* and components/merch/* stubs — removed, dead
//     code with zero references anywhere in the app.
//   - components/qr/* — also stubs, but NOT dead: /members/checkin and
//     /members/manage/attendance are real "Coming soon" pages for this
//     feature, and the backend (/api/checkin, lib/qr.ts) is fully built.
//     Legitimate unfinished work, left in place, just not synced until
//     there's a real UI to preview.
//   - SessionProvider (non-visual context wrapper).
//   - TeamCards.tsx (a duplicate re-export of TeamCardsSection).
// See CLAUDE.md's Design System section.

// UI primitives
export { Accordion } from '@/components/ui/Accordion'
export { ActivityGrid } from '@/components/ui/ActivityGrid'
export { Avatar } from '@/components/ui/Avatar'
export { Badge } from '@/components/ui/Badge'
export { Button } from '@/components/ui/Button'
export { Card } from '@/components/ui/Card'
export { Countdown } from '@/components/ui/Countdown'
export { Modal } from '@/components/ui/Modal'
export { StatusIndicator } from '@/components/ui/StatusIndicator'

// Layout — shared across public pages (and PortalNav for the portal)
export { Navbar } from '@/components/layout/Navbar'
export { Footer } from '@/components/layout/Footer'
export { Subnav } from '@/components/layout/Subnav'
export { PortalNav } from '@/components/layout/PortalNav'

// Public marketing page sections
export { AboutSection } from '@/components/public/AboutSection'
export { AlumniSection } from '@/components/public/AlumniSection'
export { GallerySection } from '@/components/public/GallerySection'
export { HeroRolodexSection } from '@/components/public/HeroRolodexSection'
export { HeroSection } from '@/components/public/HeroSection'
export { NasaRascalSection } from '@/components/public/NasaRascalSection'
export { NasaSuitsSection } from '@/components/public/NasaSuitsSection'
export { ProjectCard } from '@/components/public/ProjectCard'
export { SubteamCard } from '@/components/public/SubteamCard'
export { TeamCardsSection } from '@/components/public/TeamCardsSection'
export { TeamPhotoSection } from '@/components/public/TeamPhotoSection'

// Member portal — real client components, not the empty portal/* stubs.
// KNOWN GAP: ManageTasksClient, MessagesClient, NewsFeedClient,
// TaskListClient, and MerchPageClient are excluded here. Root cause is the
// same for all five, via two different vectors — esbuild bundles Next.js
// Server Actions and next-auth/react as plain JS (it doesn't apply Next's
// RSC/'use server' transform that normally strips these to lightweight
// client stubs), which pulls in server-only code needing Node builtins
// (crypto, querystring, etc.) into a browser bundle:
//   - ManageTasksClient/MessagesClient/NewsFeedClient/TaskListClient call
//     useSession() from next-auth/react (added for the Supabase JWT
//     bridge) — that module isn't tree-shaken, so importing anything from
//     it pulls in next-auth's full server core.
//   - MerchPageClient imports claimFlightTag from app/actions/merch.ts, a
//     'use server' action that calls getServerSession(authOptions) —
//     bundled generically, that's the same server core again.
// No sanctioned way to mark next-auth as external without forking
// bundle.mjs, which the skill explicitly says not to do. Revisit if/when
// this matters more — options are a repo-side wrapper that avoids the bare
// next-auth import for design-sync's purposes, or accepting these five as
// floor cards.
export { default as HelpClient } from '@/app/members/help/HelpClient'
