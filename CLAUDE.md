# CLAWS Website — CLAUDE.md

## Project Overview
The CLAWS (Collaborative Lab for Advancing Work in Space) website for the
University of Michigan. Two connected experiences: a public marketing site
and a private member portal that serves as a full org management platform.

The goal is for members to feel proud and engaged — this portal should feel
as polished as a top-tier startup product, not a university club website.

Original site: https://claws.engin.umich.edu
Contact: claws-admin@umich.edu

---

## Organizational Context
CLAWS is currently a Sponsored Student Organization (SSO) under Michigan
Engineering, in the process of transitioning to an independent 501(c)(3)
nonprofit. This affects infra decisions:

- **Google Cloud/Workspace path is not yet decided** — two options are on
  the table: (a) a Google Cloud project under the nonprofit's own future
  identity (Google Workspace for Nonprofits, once 501(c)(3) status lands —
  free, verified via TechSoup), or (b) going through UMich via the faculty
  advisors, likely meaning `claws.admin@umich.edu` (a U-M Google "Shared
  Account" — per ITS policy, these can only be owned by faculty/staff, not
  students, so this path needs the faculty advisor as the formal owner).
  Neither is confirmed. Don't assume either path when making infra
  decisions — check with the maintainer first. Whichever is chosen, a
  UMich-governed project would NOT transfer to the nonprofit entity if (a)
  ends up being pursued instead later, so treat any UMich-hosted Google
  Cloud work as potentially interim.
- Auth model implication: Google OAuth restricted to @umich.edu works for
  current student members, but the eventual goal is broader access
  (companies/sponsors, alumni who lose @umich.edu, faculty) — that requires
  moving from a hardcoded domain check to an invite/allowlist model against
  the `members` table. Not yet built — see `lib/auth.ts`'s `signIn`
  callback for the current (temporary) domain restriction.
- Longer-term auth idea (not yet built): physical member cards with NFC,
  enrolled via UMich MCard swipe, each carrying a WebAuthn passkey — used
  both for Venmo payment authorization to CLAWS and for signing into a
  future native CLAWS app. If/when this is built, keep the payment-auth
  credential and the identity/session credential separate even on the same
  physical card, so a lost/cloned card can't grant both money and account
  access through one factor. Google OAuth remains the right primary auth
  for the web portal regardless of what else gets added later.
- Deployment: self-hosted via Cloudflare Tunnel through UMich ITS, not
  Vercel — see Deploy section. The maintainer (mjmal@umich.edu) is the
  admin for this repo specifically.

---

## Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript — no `any` anywhere
- Tailwind CSS — no inline styles, no CSS-in-JS
- Framer Motion — animations, page transitions, badge unlocks
- NextAuth.js — Google OAuth, restricted to @umich.edu (temporary — see
  Organizational Context)
- Supabase — Postgres DB + Storage + Row Level Security
- Self-hosted (pm2 + Cloudflare Tunnel via UMich ITS) — deployment target
- qrcode / html5-qrcode — QR generation + mobile scanning
- Slack Web API — post to channels, send DMs
- Google Calendar API — sync events to member calendars
- Claude Design (claude.ai/design) — see Design System section

---

## Role Hierarchy
member < leadership < faculty

member      Standard active member. If subteams.lead_id matches
            their id they are a subteam lead — checked at query
            time from the subteams table. No separate role or
            is_lead column exists on members.
leadership  Org-wide admin. Full read/write access everywhere.
faculty     Read-only access + reports + faculty-specific docs.
alumni      Read-only portal. No tasks, no merch.

Subteam lead unlocks (derived, not a role):
  - See all subteam sections in Help
  - Assign tasks to own subteam members
  - See own subteam roster + attendance in Manage
  - Post to own subteam Slack channel from portal

---

## Routes

### Public
/                        Home
/about, /about/projects, /about/subteams, /about/supporters, /about/faq
/team, /team/pm, /team/board, /team/subteam-leads, /team/members,
  /team/alumni, /team/faq
/events, /events/news, /events/community
/join, /join/apply, /join/contact, /join/faq

### Member Portal (protected — @umich.edu only)
/members                         Dashboard
/members/profile, /members/profile/[id]
/members/settings, /members/notifications
/members/tasks                   Personal task list
/members/merch                   Merch store + schedule + order history
/members/help                    Drive links filtered by role + subteam
/members/news                    Announcements + Slack mirror
/members/messages                Channels + DMs
/members/subteam/[slug]          Subteam page (9 subteams)
/members/checkin                 QR scanner — mobile optimized
/members/manage                  Lead + leadership + faculty only
/members/manage/attendance, /members/manage/members,
  /members/manage/tasks, /members/manage/merch, /members/manage/news

Page content lives in the actual route files — this doc doesn't duplicate
per-page copy/layout; read `app/(public)/**/page.tsx` and `app/members/**`
directly for that.

### Layout structure
app/layout.tsx                 Root — main Navbar + Footer
app/about|team|events|join/layout.tsx  Sticky subnav per section
app/members/layout.tsx         Portal nav (avatar + bell + Manage)
app/members/manage/layout.tsx  Manage subnav

Subnav behavior: each subnav item is a real page at its own URL (never
tabs). Subnav sticks below main nav within that section, highlights the
active subroute; main nav highlights the parent section on any subroute.

---

## Auth Architecture
NextAuth (Google OAuth) is the only auth system — Supabase Auth is not
used at all. This has one important consequence: Postgres's `auth.uid()`
is meaningless by default for any Supabase request, since no Supabase
session ever exists.

`lib/auth.ts`'s `jwt` callback bridges this: on every session read, it
mints a short-lived (1h) Supabase-compatible JWT (`SignJWT` from `jose`,
signed with `SUPABASE_JWT_SECRET` — the project's Legacy JWT Secret from
Project Settings → API → JWT Settings) with `sub` set to the member's real
`members.id` row and `role: 'authenticated'`. That token is exposed as
`session.supabaseAccessToken` and passed into `createBrowserSupabaseClient()`
(`lib/supabase.ts`) by every client component that needs realtime or
storage access from the browser. With that token, `auth.uid()` resolves
correctly and RLS policies — all written assuming `auth.uid() = members.id`,
via the `auth_role()` / `auth_subteam()` / `is_subteam_lead()` helper
functions — actually enforce.

Server-side code never needs this — `createServerSupabaseClient()` always
uses the service-role key, which bypasses RLS entirely. NextAuth's own
session check is what gates server-side access; RLS matters specifically
for direct browser→Supabase calls (realtime subscriptions, storage
uploads) in `TaskListClient.tsx`, `ManageTasksClient.tsx`,
`MessagesClient.tsx`, and `NewsFeedClient.tsx`.

**Operational note — verify RLS live, don't trust the migration alone**:
migration files describe intent, not guaranteed live state (this repo's
live schema has drifted from its migrations before). Before relying on a
table's RLS being correct, check directly:
```sql
select relname, relrowsecurity from pg_class where relname = '<table>';
select policyname, cmd, roles, qual, with_check from pg_policies where tablename = '<table>';
```

**Legacy JWT secret, not Third-Party Auth**: the shared-secret HS256
approach above needs zero extra Supabase-side setup and matches this
project's existing anon-key format. The tradeoff: leaking
`SUPABASE_JWT_SECRET` would let someone forge a `service_role` token, not
just impersonate a member — it's the same secret Supabase itself uses for
everything. Supabase's Third-Party Auth (NextAuth signs with its own key,
Supabase verifies via a JWKS endpoint NextAuth would expose) is the more
scoped, more secure alternative, but it requires a publicly-reachable JWKS
URL — not possible until there's a real deployment. Revisit once the
Cloudflare Tunnel is live.

### First Login Flow
1. Google OAuth → @umich.edu verified (non-@umich.edu → error page +
   link to /join)
2. Supabase creates member row (role: member, active: true) via
   `lib/auth.ts`'s `jwt` callback, service-role client
3. Slack bot sends welcome DM
4. Onboarding checklist → full dashboard unlocks once complete

---

## QR Check-in Flow
1. Leadership/lead creates event in Manage → Attendance
2. System generates `qr_token` (uuid) + `qr_expires` (15min window)
3. Fullscreen QR shown on leader's screen
4. Member scans via `/members/checkin` on phone → POST `/api/checkin`
5. Server validates: token exists · not expired · member authenticated ·
   no duplicate attendance row
6. Insert attendance row (method: qr) → award points → recalculate streak
   (`lib/engagement.ts`) → run badge logic server-side
7. Member sees confirmation + badge unlock animation if earned
8. Slack DM confirmation

---

## Membership Policy

### Points
ATTENDANCE: all-hands +15 · subteam +10 · outreach/community +20 ·
  NASA milestone +30 · JSC/competition +100
TASKS: on-time +15–25 (per task) · 2+ days early +5 bonus ·
  subteam-wide +10
ENGAGEMENT (one-time unless noted): first check-in +25 · onboarding
  complete +50 · spotlight +40 · 5-week streak +30 · 10-week streak +75

Points are a score only — no tiers, no labels attached to totals.
150pt minimum per semester required for active status.

### Active Membership Requirements (per semester)
- 70% of all-hands + 70% of subteam meetings attended (unexcused absences
  count against %; must request in advance via portal)
- 80% of assigned tasks completed, no more than 2 overdue at once
- Minimum 150pts

Warnings: week 8 below 150pts → notification + leadership check-in.
Week 12 below 75pts → leadership review → possible inactive.

Inactive: loses task/merch access, retains read-only news + help.
Reactivation via petition to leadership next semester.

Grace: 1 unexcused absence forgiven automatically per semester.
Medical/personal exceptions and academic-probation accommodations are
reviewed by leadership case by case.

Status: 🟢 Active · 🟡 At Risk (week 8 warning sent) · 🔴 Review (week 12
threshold hit) · ⚫ Inactive

---

## Merch Schedule
Semester-specific — dates below are Spring 2026 and need updating each
semester rather than treated as permanent. Drop-gating logic lives in
`lib/merch.ts`.

Mar 18  Flight Line drops — free flight tags, flight jacket orders open
Mar 25  Flight jacket order deadline
Apr 1   Collectibles Line drops — patches/pins rolling, stickers/claw
        clips/mugs due Apr 8
Apr 18  Sweat Line drops — sweatpants, sponsor t-shirts, sweatshirts
Apr 25  Sweat line deadline — end of semester

Portal states per item: before `opens_at` → locked teaser; after
`opens_at` → live with countdown to `closes_at` if applicable; rolling
items → "order anytime"; after `closes_at` → "orders closed".

---

## Slack Integration Touchpoints
AUTOMATED: welcome DM on first login · check-in confirmation ·
  meeting agenda before event · week-8 at-risk warning ·
  absence approved/denied
MANUAL: member posts to subteam channel from subteam page · leadership
  announcement mirrors to #general

## Google Calendar Integration
Member connects in Settings → Integrations. All CLAWS events auto-sync;
portal updates sync back to calendar.

---

## Database Schema
Source of truth is `supabase/migrations/*.sql`, not this section — read
the migration files for exact columns/types/constraints. Table list for
quick reference:

**`001_initial.sql`**: members, subteams, events, attendance,
absence_requests, tasks, badges, member_badges, drive_links, merch_items,
merch_orders, flight_tag_claims, news_posts, notifications, faqs,
spotlights

**`002_baseline_reconciliation.sql`**: tables that existed live but were
never captured in a migration until reconciled here —
- `task_attachments` — file uploads on tasks
- `channels`, `channel_messages`, `dm_threads`, `dm_messages` — messaging
  (`app/members/messages/`), still being actively built out; RLS is real
  and sound (participant-scoped, leadership-gated channel creation) but
  the schema isn't necessarily final
- `gallery_photos`, `supporters` — public home-page gallery and
  `/about/supporters`

If a table's live behavior doesn't match what's in these files, the live
project is what's real — check `pg_policies`/`pg_class` directly (see Auth
Architecture) rather than assume the SQL file is current.

## Supabase Storage Buckets
avatars/      private — {member_id}.jpg
merch/        public — {item_slug}.jpg
news/         public — {post_id}.jpg
public/       public — team-photo.jpg · gallery/ · sponsors/
site-images/  public — general site imagery
attachments/  private — task attachments, 50MB limit, MIME allowlist.
              `file_url` in `task_attachments` is a raw storage path, not
              a usable link — `lib/supabase.ts`'s `signAttachmentUrls()`
              signs it fresh (1h) on every fetch. Never call
              `getPublicUrl()` on this bucket, it won't produce a working
              URL.

---

## /lib Structure
/lib/supabase.ts      Supabase browser + server clients, typed queries
/lib/auth.ts          NextAuth config, @umich.edu check, Supabase JWT bridge
/lib/engagement.ts    Points award, streak calc, badge logic
/lib/qr.ts            QR token generation + validation
/lib/slack.ts         Slack Web API — DMs + channel posts
/lib/calendar.ts      Google Calendar sync
/lib/merch.ts         Drop date gating, countdown logic
/lib/policy.ts        Membership status calculation

## /components Structure
/components/ui/       Button, Card, Badge, Modal, Accordion, Avatar,
                       Countdown, StatusIndicator, ActivityGrid — the
                       true reusable primitives, no Next.js-specific
                       imports except Avatar's next/image
/components/layout/   Navbar, Footer, Subnav, PortalNav, SessionProvider
/components/public/   Public marketing page sections (composed,
                       page-specific — not generally recomposed elsewhere)
/components/merch/    MerchCard, Timeline, Countdown, OrderModal,
                       OrderHistory
/components/qr/       QRDisplay, QRScanner

There is no `/components/portal` — a `dashboard/`+`manage/` subtree there
was all empty placeholder stubs (`return null`) and was removed. The real
member-portal UI (task list, messages, manage pages) lives directly under
`app/members/**/*Client.tsx` as substantial 'use client' components, not
under `/components`.

---

## Design System (Claude Design)
This repo syncs a subset of its component library to a Claude Design
(claude.ai/design) project so the design agent there can build with real
CLAWS components instead of generic ones. Setup lives in `.design-sync/`
and `.ds-sync/` (gitignored staged converter scripts).

**Scope is primitives-first, not everything**: `components/ui/*`,
`components/merch/*`, `components/qr/*`, plus the real member-portal
client components under `app/members/**/*Client.tsx`. Deliberately
excluded: `components/public/*` (page-specific composed sections a design
agent wouldn't recompose the way it recomposes a Button or Card) and
anything requiring `next/image`/`next/link`/`usePathname` where those
can't be made to render correctly outside a real Next.js server — those
degrade to the tool's honest "floor card" placeholder rather than a full
preview, which is expected, not a failure to chase.

Workflow: design in Figma comes *after* Claude Design, not before —
Claude Design is the primary place new UI gets designed/built using the
real component library; Figma's role in that sequence isn't finalized yet.

---

## Coding Standards
- Functional components only — no class components
- TypeScript — no `any`
- One component per file
- Tailwind only — no inline styles, no CSS-in-JS
- Next.js `<Image>` for all images; all images in /public or Supabase
  storage — no Framer CDN
- Server components by default; `'use client'` only for hooks, browser
  APIs, interactivity
- All DB queries in `/lib/supabase` only
- All engagement logic in `/lib/engagement.ts` only
- All merch schedule logic in `/lib/merch.ts` only
- Mobile-first throughout — `/members/checkin` critical on phone
- ESLint 9 flat config (`eslint.config.mjs`) — there is no `.eslintrc.json`.
  `next lint` was removed in Next 16; `npm run lint` calls `eslint .`
  directly.
- Proxy file is `proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`;
  same default-export convention, NextAuth's `withAuth()` still works
  as-is)

---

## Design (Visual)
- Match dark space aesthetic of https://claws.engin.umich.edu
- Background: #0a0a0f (deep dark, not pure black)
- Typography: clean white, strong hierarchy
- Public site: cinematic, scroll-driven, full-bleed photography
- Portal: mission control feel — structured, data-forward, same palette
  and typography as public site. Members should feel they went deeper
  into the same world, not into a different product.
- Framer Motion: scroll animations on public pages, page transitions,
  badge unlock celebration, QR check-in success animation
- Mobile-first — dashboard and QR check-in must be excellent on phone

---

## What NOT To Do
- Do not use Canvas LMS — fully descoped
- Do not build Google Drive API — links open in new tab only
- Do not use class components
- Do not hardcode colors — use tailwind.config.ts tokens
- Do not put DB queries in components — always /lib/supabase
- Do not use `any` in TypeScript
- Do not build drag-and-drop for tasks
- Do not add member tiers or labels to points
- Do not make subroutes tabs — they are real navigable pages each with
  their own URL
- Do not refactor away from `next/image`/`next/link` to make the design-
  sync tool's job easier — that coupling is intentional, production-
  appropriate code; the sync scope is narrowed to avoid needing it instead
- Do not assume RLS matches the migration files without checking live
  (see Auth Architecture)

---

## Local Development
npm run dev
  Site: localhost:3001 (3000 is reserved for the separate claws-formal
  event app — see .claude/launch.json)

Dev points at the hosted Supabase project (CLAWS_UM org), not a local
Docker stack — there is no `supabase start` step in the normal flow.

.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-only, bypasses RLS — never expose to the browser
SUPABASE_JWT_SECRET=             # Project Settings -> API -> JWT Settings -> Legacy JWT Secret
                                  # mints the Supabase-compatible token from the NextAuth
                                  # session (lib/auth.ts) so RLS's auth.uid() resolves for
                                  # the browser client (realtime + storage uploads)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SLACK_BOT_TOKEN=
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=

## Deploy
Self-hosted via Cloudflare Tunnel through UMich ITS (not Vercel — see
Organizational Context for why). Production build (`npm run build && npm
run start`) kept alive via pm2; tunnel ingress points at the local port.
DNS/tunnel registration is coordinated with UMich ITS — see
`ecosystem.config.js` and `cloudflared/config.yml` once set up.

## Commands
npm run dev          local dev server
npm run build        production build
npm run lint         eslint .
npm run typecheck    tsc --noEmit

---

## In Progress / Open Questions
Tracked here so future sessions have context, but none of this is decided
— don't build against it as if it were spec.

- **3D**: no concrete feature planned. General future-proofing request
  only — avoid architectural choices that would preclude adding a 3D
  layer (e.g. a WebGL/Three.js scene) later.
- **Figma**: comes after Claude Design in the intended workflow, but the
  actual handoff/round-trip mechanics aren't defined yet.
- **Private/public repo restructuring**: the maintainer has flagged that
  the repo structure may need reorganizing around the public/private
  (marketing site vs. member portal) workflow going forward, given they're
  the sole maintainer/admin. No concrete proposal exists yet — don't
  restructure directories preemptively based on this note alone.
- **Google Cloud/Workspace path**: see Organizational Context — genuinely
  unresolved, two live options.
