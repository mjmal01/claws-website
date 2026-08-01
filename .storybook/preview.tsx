import type { Preview } from '@storybook/nextjs-vite'
import '../app/globals.css'
// app/globals.css references var(--font-space-grotesk)/--font-geist-sans/
// --font-geist-mono, but those custom properties are normally injected by
// Next's own next/font build-time className on <html> — a plain Storybook
// build never performs that step, so without this the variables resolve to
// nothing and text falls through the whole font-family stack to the
// browser's serif default (found via design-sync compare: the reference
// storybook was silently rendering serif body text, making itself the wrong
// oracle for every text-heavy component's grade). Same real font files and
// @font-face rules used by design-sync's own cssEntry compile — see that
// file's header for the vendoring/regeneration notes.
import '../.design-sync/fonts.css'

const preview: Preview = {
  parameters: {
    // Everything in this repo is App Router (no pages/ dir) and reads
    // next/navigation's usePathname/useSearchParams. @storybook/nextjs-vite's
    // router decorator only mounts Next's real PathnameContext when this is
    // true — unset, it silently falls back to the legacy Pages Router mock,
    // which provides no PathnameContext, so usePathname() returns null and
    // any component doing pathname.startsWith(...) throws in Storybook itself
    // (found via Navbar/PortalNav sb-error during design-sync compare).
    nextjs: {
      appDirectory: true,
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    // Matches CLAWS's dark space aesthetic (#0a0a0f) — see CLAUDE.md's
    // Design section. Components render on the real background they'll
    // actually appear on, not Storybook's default white/gray.
    backgrounds: {
      default: 'claws-dark',
      values: [{ name: 'claws-dark', value: '#0a0a0f' }],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;