# Design-sync notes — claws-website

## Fixes applied

- **`[TOKENS_MISSING]` — Geist Sans/Mono + Space Grotesk custom properties.**
  `app/layout.tsx` uses `next/font/local` (Geist Sans/Mono, real files at
  `app/fonts/*.woff`) and `next/font/google` (Space Grotesk) — both inject
  `--font-*` custom properties + `@font-face` rules into `<html>` at Next's
  own build time, invisible to design-sync's standalone `tailwindcss` CLI
  compile of `cssEntry`. Fixed by vendoring the real font files into
  `.design-sync/fonts/` (Geist copied from `app/fonts/`; Space Grotesk's 3
  woff2 subset files pulled from Next's `.next/static/media/` build cache)
  and authoring `.design-sync/fonts.css` with matching `@font-face` +
  `:root` custom-property declarations, appended to the compiled
  `cssEntry` output via `design-sync:prep`'s npm script (`cat
  .design-sync/fonts.css >> .design-sync/dist/tailwind.css`). Validated:
  10 `@font-face` rules detected, fonts copied to `ds-bundle/fonts/`,
  `[TOKENS_MISSING]` warning gone.
  Regenerate `.design-sync/fonts/`'s Space Grotesk files from
  `.next/static/media/` (after a `next build`/`next dev` run) if the font
  or its weights ever change — there's no cfg-level Google Fonts fetch.

- **`[GENERAL]` `usePathname()` returns null in the REAL Storybook build**
  for every App Router component (`Navbar`, `PortalNav` hard-crashed with
  `sb-error`: `Cannot read properties of null (reading 'startsWith')`;
  `Subnav` silently rendered with NO active-link highlighting on either
  story — same null pathname, but its `pathname === href` comparison
  doesn't throw on null, so it degraded silently instead of erroring).
  Root cause: `@storybook/nextjs-vite`'s `RouterDecorator` only mounts the
  real `PathnameContext` (via `AppRouterProvider`) when
  `parameters.nextjs.appDirectory` is truthy — unset, it silently falls
  back to the legacy Pages Router mock, which provides no
  `PathnameContext` at all. This repo has no `pages/` dir — 100% App
  Router — so this needs to be true globally. Fixed by adding
  `nextjs: { appDirectory: true }` to `.storybook/preview.tsx`'s global
  `parameters`. This is a real Storybook config bug independent of
  design-sync — worth knowing if `npm run storybook`'s dev server ever
  seems to have the same null-pathname symptom.
  Verified via direct Playwright script against the real
  `.design-sync/sb-reference/iframe.html` (bypassing compare.mjs's
  summarized error text) — full stack trace confirmed the throw site was
  `Navbar.tsx`'s `isActive`, not story-file code.

## Known limitations — NOT fixable via sanctioned config (recorded, not worked around)

- **`[GENERAL]` `cardMode: "single"` breaks components using `position:
  fixed` with a `bottom`/`inset-0` (i.e. anything sized relative to full
  viewport HEIGHT, not just `top`/`left`/`right`).** Root cause: `emit.mjs`'s
  `.ds-single{transform:translateZ(0)}` rule (any non-`none` transform,
  even an identity one) makes `.ds-single` the CSS containing block for
  `position: fixed` descendants — but `.ds-single` itself is never given
  explicit viewport dimensions (`position: static`, `height: auto`, and
  since its only child is `fixed` — removed from normal flow — its
  auto-height collapses to ~0px). A `fixed inset-0` descendant (needs
  `bottom: 0` resolved against a real height) collapses/clips instead of
  covering the viewport. Confirmed via direct DOM inspection
  (`getComputedStyle` on `.ds-single` showed `height: 0px`) in BOTH the
  `?story=` grading capture AND the actual product-card render (no `?story=`
  query) — this is not a grading-only artifact, it ships broken.
  Components anchored only by `top`/`left`/`right` (no `bottom`/`inset-0`)
  are unaffected — e.g. `Navbar`/`PortalNav` (`fixed top-0 inset-x-0`) render
  correctly under the same `cardMode: "single"` mechanism.
  **Affects: `Modal`** (`fixed inset-0` backdrop + centered dialog — both
  stories clip to ~32px tall at the very top of the viewport instead of
  centering with a full backdrop). Graded `mismatch` on both stories — this
  is a converter bug in `emit.mjs`, which the skill explicitly forbids
  forking ("app-contract surface — never fork"). No `cfg.*` knob addresses
  it. If this converter's `emit.mjs` is ever updated upstream, re-grade
  `Modal` to confirm.

- **`[GENERAL]` `next/image` with a local `/public`-relative `src` has no
  working path through this converter.** `next/image` generates
  `/_next/image?url=<path>&w=...&q=...` URLs — Next's own image-optimization
  proxy route, which only exists inside a running `next dev`/`next start`
  server. `ds-bundle`'s standalone static server (and, as far as the base
  skill's upload file-layout table shows, the actual claude.ai/design
  runtime too — its upload contract only lists `fonts/`, `_vendor/`,
  `_preview/`, `tokens/`, `guidelines/`, `components/<group>/<Name>/*`,
  nothing for arbitrary `/public` assets) has no route matching that shape
  → every such image 404s. Unlike fonts (`cfg.extraFonts` copies real font
  files referenced via `@font-face` `url()` and rewrites the CSS), there is
  no equivalent config lever for `<img>`/`next/image` `src` attributes — the
  css/font scraping mechanism only understands `@font-face`, not arbitrary
  runtime `<img>` tags. Setting `next.config.mjs`'s `images.unoptimized`
  doesn't help either: that config isn't read by esbuild's bundling (a
  separate pipeline from `next build`/`next dev`), and even swapping the URL
  shape to a raw `/images/...` path wouldn't resolve — that path was never
  copied into `ds-bundle/` or the upload manifest either.
  **Affects 7 of 25 synced components**, concentrated in the
  highest-priority `Public/*` marketing group: `GallerySection` (8 photos),
  `HeroRolodexSection`, `HeroSection`, `NasaRascalSection`,
  `NasaSuitsSection`, `TeamCardsSection` (per-subteam icons), and
  `TeamPhotoSection`. All render structurally correct (headings, copy,
  layout) with broken-image placeholders/alt-text where photography should
  be. Graded `mismatch` with this note rather than silently passing.
  No action taken pending user decision on how to proceed (accept as a
  documented limitation vs. exclude these components from the sync scope).

## Needs further investigation (not yet root-caused)

- **`HelpClient`** — DS preview renders structurally present (icons, layout
  skeleton, card grid) but almost all text/labels and the dark background
  are missing across all 4 role stories (Member/Subteam Lead/Leadership/
  Faculty). Not yet diagnosed — leading hypothesis is a Tailwind
  dynamic-class-name gap (some of `HelpClient.tsx`'s classNames may be
  built via template strings/helpers rather than complete literal
  strings, which Tailwind's static scanner can't detect even though
  `tailwind.config.ts`'s `content` glob does cover
  `app/members/help/HelpClient.tsx`) — not confirmed. Left `needs-grade`,
  not graded, pending further diagnosis.

## Fixes applied (fan-out wave)

- **`[GENERAL]` Most components without their own opaque background rendered
  white-on-white (some fully invisible) in the preview.** Same root cause as
  the already-fixed `HelpClient`: `.storybook/preview.tsx`'s `backgrounds`
  parameter only paints the real Storybook canvas iframe, never
  design-sync's independently-compiled preview page, and these components
  assume a dark parent layout in production. Fixed per-component via a
  `decorators: [(Story) => <div className="bg-space ...">…]` added to each
  affected component's own story-file `meta` (not a config/converter
  change): `Accordion`, `ActivityGrid`, `Avatar`, `Badge`, `Button`,
  `Countdown`, `StatusIndicator`. If a newly-added component renders
  correctly in the real Storybook but shows blank/washed-out/invisible text
  in a design-sync compare sheet, check this first before assuming a deeper
  bug.

- **`[GENERAL]` The reference storybook build itself never received the
  app's real fonts — its `<html>`/`<body>` silently fell back to a serif
  default (Times) instead of Space Grotesk/Geist Sans, because
  `--font-geist-sans`/`--font-space-grotesk` are only ever defined by
  `next/font`'s build-time `className` on `<html>` in `app/layout.tsx`,
  which Storybook never renders — `.storybook/preview.tsx` only imported
  `app/globals.css`, which references those vars but never defines them.
  This made the compare oracle itself wrong for any text-heavy component
  (small text hid it; `TeamPhotoSection`'s ~80px headline made it obvious).
  Mirror of the already-documented `[TOKENS_MISSING]` fix, which only ever
  patched the **preview/ds-bundle** side's `cssEntry`, never the reference.
  Fixed by importing the same `.design-sync/fonts.css` (real vendored font
  files + `@font-face`/`:root` block) directly into
  `.storybook/preview.tsx`, then rebuilding `.design-sync/sb-reference`.
  **Any grade recorded before this fix landed was potentially judged
  against a wrong-font oracle** — not re-verified across the board before
  upload per explicit user direction ("don't need a perfect match, just
  upload — I'll be changing components anyway"). If a synced component's
  typography looks off in claude.ai/design, re-check it against a freshly
  built reference before assuming the component itself is wrong.

- **`[ActivityGrid]` `[GRID_OVERFLOW]`** — stories render wider than their
  grid cell (product would crop them). Fixed via
  `cfg.overrides.ActivityGrid.cardMode: "column"` + targeted preview
  rebuild.

## Known, not re-verified before upload (deliberate — see above)

- `AlumniSection`'s topmost `whileInView` element (the "Alumni" eyebrow)
  didn't settle to its visible state in the storybook reference capture,
  while identical-pattern siblings just below it did — looks like a
  capture-harness timing issue with IntersectionObserver-gated animations
  near the capture viewport's rootMargin boundary, not a component bug (the
  DS preview showed the correct, fully-settled state). No component-level
  fix available.
- `HeroRolodexSection` (880vh scroll-pinned), `NasaRascalSection`,
  `NasaSuitsSection` — the compare capture's fixed ~700px viewport height is
  shorter than these fullscreen sections' true rendered height (up to
  6160px), so content below the fold wasn't part of the graded screenshot.
  No grade was actually changed by this (extra height was empty scroll
  space or an already-404'd photo tail), but any FUTURE fullscreen
  component taller than ~700px could silently lose real content from
  grading. Fix would be a per-component `cfg.overrides.<Name>.viewport`.

## Re-sync risks

- The `Modal` and `next/image`-local-asset limitations above are both
  converter-level, not repo-level — they will resurface identically on
  every future rebuild until the converter itself changes. Don't
  re-diagnose them from scratch; re-verify they still reproduce (a
  converter update might fix either) and move on.
- `.design-sync/fonts.css`'s Space Grotesk `@font-face` `url()`s point at
  hash-named files vendored from a specific `next build`/`next dev` run's
  cache (`.next/static/media/`) — those hashes are content-addressed so
  they're stable unless the font itself changes, but there's no automated
  re-vendor step if Space Grotesk's version/weights change upstream.
