# CLAWS Design System — conventions

CLAWS (Collaborative Lab for Advancing Work in Space, University of
Michigan) — a dark, "mission control" aesthetic shared across the public
marketing site and the private member portal. Members should feel they went
deeper into the same world when moving from public pages into the portal,
not into a different product.

## Visual language

- Background is always dark — `#0a0a0f` (`bg-space` token), never white or
  light gray. Almost no component in this system ships its own background;
  they're designed to sit on that dark canvas. When composing a screen,
  wrap content in a dark-bg container rather than assuming a component will
  supply one.
- Typography: **Space Grotesk** for display/heading text, **Geist Sans**
  for body text, **Geist Mono** for monospace/data contexts. Both are
  self-hosted, not loaded from a CDN.
- Framer Motion drives scroll animations on public pages, page transitions,
  and small celebratory moments (badge unlocks, QR check-in success) — favor
  subtle, physical-feeling motion over abrupt state changes.
- Mobile-first throughout, with `/members/checkin` (QR scanner) as the
  highest-bar mobile surface.

## Component notes worth knowing before composing with these

- **`Modal`** renders correctly in the real app but its packaged preview
  card is a known, unfixed limitation of this sync tool (a `fixed inset-0`
  overlay collapses under the tool's single-card containment wrapper) — the
  card's framing may look broken even though the component itself works
  correctly when actually used in the app.
- Several **public marketing components** (`GallerySection`, `HeroSection`,
  `HeroRolodexSection`, `NasaRascalSection`, `NasaSuitsSection`,
  `TeamCardsSection`, `TeamPhotoSection`) reference real local photography
  that this sync tool cannot ship (a `next/image` limitation) — their
  previews show broken-image placeholders where real photos belong. Treat
  the layout/structure/copy as correct and mentally substitute real
  photography.
- `Navbar`, `PortalNav`, and `Subnav` highlight the active route based on
  the current path — in a composed design, set that explicitly rather than
  assuming a default.

## Role model (relevant to any portal composition)

`member < leadership < faculty`, plus a derived "subteam lead" unlock
(not a stored role — computed from whether a member is a subteam's
`lead_id`). Leads see their own subteam's roster/attendance/tasks;
leadership sees everything; faculty is read-only.
