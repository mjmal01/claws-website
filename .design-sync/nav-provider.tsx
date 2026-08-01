'use client'

// Wraps every preview with Next.js's real PathnameContext so usePathname()
// resolves to something instead of null (Navbar/Subnav/PortalNav all use
// it for active-link highlighting). Design-sync compiles previews directly
// from component source, not through Storybook's own Vite pipeline — so
// @storybook/nextjs-vite's navigation mock, and each story's
// `parameters.nextjs.navigation.pathname`, only apply to the real
// Storybook build (verified separately), never to these compiled previews.
// Wired in via cfg.provider in .design-sync/config.json, which applies one
// fixed pathname across all previews — real per-story pathname variation
// (the *Active stories) only shows correctly in the actual Storybook.
//
// PathnameContext is Next's internal, undocumented context (no public
// export) — the same category of gap as the process-env shim next/image
// needed. Path may need updating on a future Next major if this moves.
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import type { ReactNode } from 'react'

export function NavProvider({ children, pathname = '/' }: { children: ReactNode; pathname?: string }) {
  return <PathnameContext.Provider value={pathname}>{children}</PathnameContext.Provider>
}
