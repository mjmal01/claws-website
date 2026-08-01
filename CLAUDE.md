# CLAWS Website — CLAUDE.md

## Project Overview
Rebuilding the CLAWS (Collaborative Lab for Advancing Work in Space) website
for the University of Michigan. Migrating from Framer to a maintainable
Next.js + TypeScript codebase. Two distinct but connected experiences:
a public marketing site and a private member portal that serves as a
full org management platform.

The goal is for members to feel proud and engaged — this portal should
feel as polished as a top-tier startup product, not a university club website.

Original site: https://claws.engin.umich.edu
Contact: claws-admin@umich.edu

---

## Stack
- Next.js 14 (App Router)
- TypeScript — no `any` anywhere
- Tailwind CSS — no inline styles, no CSS-in-JS
- Framer Motion — animations, page transitions, badge unlocks
- NextAuth.js — Google OAuth, restricted to @umich.edu
- Supabase — Postgres DB + Storage + Row Level Security
- Vercel — deployment target
- qrcode — QR code generation
- html5-qrcode — QR scanning on mobile
- Slack Web API — post to channels, send DMs
- Google Calendar API — sync events to member calendars

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

## Public Routes

/                        Home
/about                   About — Overview (long scrollable page)
/about/projects          Projects
/about/subteams          Subteams
/about/supporters        Supporters
/about/faq               FAQ

/team                    Team — Overview
/team/pm                 PM
/team/board              Board
/team/subteam-leads      Subteam Leads
/team/members            Members
/team/alumni             Alumni
/team/faq                FAQ

/events                  Events — Overview
/events/news             News
/events/community        Community

/join                    Join — Overview
/join/apply              Apply
/join/contact            Contact
/join/faq                FAQ

## Member Portal Routes (protected — @umich.edu only)
/members                         Dashboard
/members/profile                 Own profile
/members/profile/[id]            Another member's profile (read-only)
/members/settings                Settings + integrations
/members/notifications           Full notification history
/members/tasks                   Personal task list
/members/merch                   Merch store + schedule + order history
/members/help                    Drive links filtered by role + subteam
/members/news                    Announcements + Slack mirror
/members/subteam/[slug]          Subteam page (9 subteams)
/members/checkin                 QR scanner — mobile optimized
/members/manage                  Lead + leadership + faculty only
/members/manage/attendance       Events + QR + absence review
/members/manage/members          Roster + role management
/members/manage/tasks            Assign + manage all tasks
/members/manage/merch            Fulfill orders + flight tag claims
/members/manage/news             Post announcements

---

## Layout Structure

app/layout.tsx              Root — main Navbar + Footer
app/about/layout.tsx        About sticky subnav
app/team/layout.tsx         Team sticky subnav
app/events/layout.tsx       Events sticky subnav
app/join/layout.tsx         Join sticky subnav
app/members/layout.tsx      Portal nav (avatar + bell + Manage)
app/members/manage/layout.tsx  Manage subnav

## Subnav Behavior
- Clicking About in main nav → /about
- /about has sticky subnav: Overview · Projects · Subteams · Supporters · FAQ
- Each subnav item is a real page at /about/[page]
- Same pattern for /team · /events · /join
- Subnav sticks below main nav when inside that section
- Active subroute highlighted in subnav
- Main nav highlights parent section on any subroute
  e.g. /about/projects highlights "About" in main nav

---

## Public Pages — Full Layout

### Home (/)
1. Hero — bold headline + astronaut image + Framer Motion animation
2. 9 Team Cards — AR · AI · Infrastructure · UX · Hardware ·
   Research · Outreach · Content · Social
3. Team Photo — full bleed
4. About Section — mission blurb
5. NASA SUITS Section — photo left, text right
6. NASA RASC-AL Section — text left, photo right
7. Photos Section — scrolling gallery grid with captions
8. Alumni Section — notable alumni cards
9. Footer — CLAWS logo · nav links · LinkedIn · Instagram · email

### About (/about) — Overview
Long scrollable page containing:
- Hero: Adhav photo + president quote + text
- Org overview: mission + description + 2-3 photos
- NASA SUITS section: photo + description
- NASA RASC-AL section: photo + description
- Projects section (cards matching /about/projects)
- Subteams section (9 cards matching /about/subteams)
- Supporters section (faculty advisors + sponsors)
- [Member Login →] CTA at bottom

### /about/projects
Project cards: name · challenge · status · description
Projects: MEISSA · AR HUD · Mission Control · RASC-AL Rover

### /about/subteams
9 cards: icon · name · description · lead name
AR · AI · Infrastructure · UX · Hardware
Research · Outreach · Content · Social

### /about/supporters
Faculty advisor cards: photo · name · title · department
Sponsor logo grid: gold / silver / bronze tiers
Partner org logos + descriptions

### /about/faq
Accordion:
  What is CLAWS?
  What is the NASA SUITS challenge?
  What is the NASA RASC-AL challenge?
  What subteams can I join?
  Do I need experience to join?
  When does recruitment happen?
  How much time does it take per week?
  Is CLAWS open to all majors?
  How do I get involved as a sponsor?

### Team (/team) — Overview
Intro section linking to all subroutes with descriptions

### /team/pm
Large feature card: photo · name · major · year · bio · socials

### /team/board
Cards: photo · name · board role · major · year

### /team/subteam-leads
9 cards: photo · name · subteam · major · year

### /team/members
Filter bar: All · AR · AI · Infrastructure · UX · Hardware ·
            Research · Outreach · Content · Social
Grid: photo · name · subteam tag · major

### /team/alumni
Filter by year + subteam
Cards: photo · name · years active · now working at

### /team/faq
Accordion:
  How is the team structured?
  How do subteam leads get selected?
  What does the board do?
  Can I switch subteams mid-year?
  Who are the faculty advisors?

### Events (/events) — Overview
Intro + links to News and Community

### /events/news
Editorial cards: date · headline · photo · blurb · [Read more →]

### /events/community
Outreach event cards: date · location · description

### Join (/join) — Overview
Hero: "Join CLAWS" + mission statement + links to subroutes

### /join/apply
Hero: "Join CLAWS Fall 2026"
Recruitment timeline:
  Applications open → Info sessions → Deadline → Decisions
Embedded Google Form

### /join/contact
claws-admin@umich.edu
LinkedIn · Instagram · MaizePages
Faculty advisor contact

### /join/faq
Accordion:
  When does recruitment open?
  Is there an interview process?
  Can freshmen apply?
  Can grad students apply?
  What subteam should I apply to?
  Can I apply to multiple subteams?
  What happens after I apply?
  Is there a GPA requirement?

---

## Member Portal — Full Layout

### Portal Nav (all roles)
[avatar top-left]  Home  Tasks  Merch  Help  News  [🔔]  [Manage*]
Avatar → /members/profile
🔔 → /members/notifications with unread count badge
Manage → visible to subteam leads · leadership · faculty only

### First Login Flow
1. Google OAuth → @umich.edu verified
   Non @umich.edu → friendly error page + link to /join
2. Supabase creates member row (role: member, active: true)
3. Slack bot sends welcome DM automatically
4. Redirect to onboarding checklist:
   [ ] Complete your profile
   [ ] Read welcome guide (Drive link)
   [ ] Attend first meeting (QR check-in)
   [ ] Join your subteam Slack channel
5. Full dashboard unlocks once checklist complete

### Dashboard (/members)
1. Profile Card
   avatar · name · subteam · role
   points total · current streak
   status: 🟢 Active / 🟡 At Risk / 🔴 Review / ⚫ Inactive

2. NASA Countdown
   SUITS 2026: X days · RASC-AL 2026: X days

3. Three widgets — side by side desktop, stacked mobile
   Tasks: X due this week · [View all →]
   Attendance: X/Y meetings · [View all →]
   Spotlight: current member spotlight card

4. Latest News
   2-3 most recent announcements · [View all →]

5. Upcoming Events + Meeting Schedule
   Next 3 events: date · time · [View Agenda] · [Request Absence]

6. Subteam Activity Feed
   Recent activity across all subteams

7. Drive Quick Links
   Filtered by member's subteam + role

### Tasks (/members/tasks)
Filter bar: All · Pending · Completed · Overdue
Sections:
  OVERDUE (red accent)
  DUE THIS WEEK (yellow accent)
  UPCOMING (default)
  COMPLETED (muted)
Each task row:
  checkbox · title · due date · points value · subteam tag · assigned by
  expand → full description
Semester points total from tasks shown at bottom

### Merch (/members/merch)
HEADER
  "CLAWS Spring 2026 Collection"
  Visual timeline bar:
    Mar 18 → Mar 25 → Apr 1 → Apr 8 → Apr 18 → Apr 25
  Countdown to next drop if before drop date

FLIGHT LINE (visible Mar 18+, locked teaser before)
  Flight Tag — FREE
    Pick up at next meeting after Mar 18
    [Claim →] → marks flight_tag_claims in DB
    Shows "Claimed ✅" once done
  Flight Jacket
    Closes Mar 25 · live countdown timer
    Size selector → [Order →] → Google Form pre-filled with member email
    Shows "Orders closed" after Mar 25

COLLECTIBLES LINE (visible Apr 1+, locked teaser before)
  Patches    rolling · "Order anytime — processed weekly"
  Pins       rolling · "Order anytime — processed weekly"
  Stickers   due Apr 8 · countdown timer
  Claw Clips due Apr 8 · countdown timer
  Mugs       due Apr 8 · countdown timer

SWEAT LINE (visible Apr 18+, locked teaser before)
  Sweatpants  due Apr 25
  T-Shirts    with sponsor logos · due Apr 25
  Sweatshirts due Apr 25
  All: "End of year drop — last chance"

COMING SOON (before drop date)
  🔒 Collectibles — drops Apr 1
  🔒 Sweat Line — drops Apr 18

YOUR ORDERS
  Full history: item · size · submitted · status badge

### Help (/members/help)
🔍 Search bar at top

🌟 WELCOME TO CLAWS (all roles)
  Mission overview blurb
  [📄 Welcome Guide →]      [📄 Code of Conduct →]
  [📄 Org Overview →]       [📄 Slack Guide →]
  [📄 Member Handbook →]    [📄 Academic Calendar →]

🔵 YOUR SUBTEAM — [dynamic: member's subteam] (all roles)
  Subteam blurb + lead name + contact
  MEMBER RESOURCES
    [📁 Subteam Files →]    [📄 Brief →]
    [📄 Meeting Notes →]    [📄 Onboarding Doc →]
  LEAD RESOURCES (subteam lead + leadership only)
    [📄 Lead Handbook →]    [📄 Member Roster →]
    [📄 Subteam Budget →]   [📄 Recruiting Notes →]

🌐 ALL TEAMS (all roles)
  [📄 All-Hands Notes →]    [📁 Photo Archive →]
  [📄 SUITS Docs →]         [📄 RASC-AL Docs →]
  [📄 NASA Guidelines →]    [📄 JSC Prep →]

⚙️ OTHER SUBTEAMS — accordion (subteam leads + leadership only)
  [AR ▾] [AI ▾] [Infrastructure ▾] [UX ▾] [Hardware ▾]
  [Research ▾] [Outreach ▾] [Content ▾] [Social ▾]
  Each expands to show that subteam's member resources

🔐 LEADERSHIP ONLY (leadership only)
  [📄 Full Budget →]        [📄 Full Roster →]
  [📄 Sponsor Deck →]       [📄 Grant Docs →]
  [📄 Recruitment Plan →]   [📄 Policy Docs →]

🎓 FACULTY ONLY (faculty only)
  [📄 IRB Protocols →]      [📄 Research Docs →]
  [📄 Faculty Reports →]    [📄 Grant Applications →]

### News (/members/news)
Internal announcements feed (Supabase)
Slack #announcements mirror — last 5 posts shown inline
All roles read · leadership posts only

### Subteam Page (/members/subteam/[slug])
Header: subteam name · lead avatar · lead name · mission blurb
Members grid: cards → click → /members/profile/[id]
Active tasks assigned to this subteam
Subteam Drive links
[✏️ Post to #[slug] →] Slack compose modal

### Profile (/members/profile/[id])
Avatar · name · subteam · role · joined date
Points total · current streak · semester attendance %
Contribution timeline — GitHub-style activity grid
  (tasks completed + check-ins per day, current semester)
Bio — editable on own profile only
[✏️ Edit Profile] shown on own profile only

### Settings (/members/settings)
PROFILE
  name · bio · avatar (Google sync or upload)
NOTIFICATIONS
  [x] Task due reminders
  [x] New announcements
  [x] Badge unlocks
  [ ] Slack activity in portal
  [x] Event reminders
  [x] Absence status updates
INTEGRATIONS
  Google Calendar [Connect →] syncs all CLAWS events
  Slack [Connected ✓] @umich workspace

### Notifications (/members/notifications)
Full feed sorted newest first:
  badge unlocks · task reminders · announcements ·
  event reminders · absence approved/denied · warnings
[Mark all read] button

### Manage (/members/manage)
Visible to: subteam leads · leadership · faculty
Sticky subnav: Attendance · Members · Tasks · Merch · News

ATTENDANCE (/members/manage/attendance)
  [+ Create Event] — lead: own subteam · leadership: any
  Event list: title · date · type · attendance count
  Click event → roster: present / absent / excused / pending
  [Show QR Code] → fullscreen QR for check-in
  Absence request queue → [Approve] [Deny] per request
  leads: own subteam events only
  leadership: all events
  faculty: read-only

MEMBERS (/members/manage/members)
  Searchable roster: name · email · subteam · role · status
  Click member → edit role / subteam / active status
  leads: own subteam only
  leadership: everyone
  faculty: read-only + [Export CSV]

TASKS (/members/manage/tasks)
  [+ Create Task] → assign to member or whole subteam
  Task list: title · assignee · due date · status · points
  leads: own subteam members only
  leadership: anyone

MERCH (/members/manage/merch)
  Order queue: name · item · size · submitted · status
  [Mark Fulfilled] per order
  Flight tag list: member name · claimed · [Mark Picked Up]
  leadership only

NEWS (/members/manage/news)
  [+ Post Announcement]
  Post list: title · date · author · [Edit] [Delete]
  leadership only

---

## QR Check-in Flow
1. Leadership or lead creates event in Manage → Attendance
2. System generates qr_token (uuid) + qr_expires (15min window)
3. [Show QR Code] → fullscreen QR on leader's screen
4. Member opens /members/checkin on phone
5. Camera scans QR → POST to /api/checkin
6. Server validates:
   token exists · not expired · member authenticated ·
   no duplicate attendance row
7. Insert attendance row (method: qr)
8. Award points → members.points += event type points
9. Recalculate streak in /lib/engagement.ts
10. Run badge logic server-side
11. Member sees: "✅ Checked in! +15pts 🔥"
    Badge unlock animation if new badge earned
12. Slack DM to member: "You checked in to [event] 🚀"

---

## Membership Policy

### Points Earning
ATTENDANCE
  All-hands meeting                    +15pts
  Subteam meeting                      +10pts
  Outreach / community event           +20pts
  NASA challenge milestone             +30pts
  JSC / competition                    +100pts

TASKS
  Complete on time                     +15–25pts (set per task)
  Complete 2+ days early               +5pts bonus
  Subteam-wide task                    +10pts

ENGAGEMENT
  First check-in ever                  +25pts (one time)
  Complete onboarding checklist        +50pts (one time)
  Member spotlight awarded             +40pts
  5-week attendance streak             +30pts
  10-week attendance streak            +75pts

Points are a score only. No tiers. No labels attached to totals.
150pt minimum per semester required for active status.

### Active Membership Requirements (per semester)
ATTENDANCE
  70% of all-hands meetings attended
  70% of subteam meetings attended
  Unexcused absences count against percentage
  Absences must be requested in advance via portal

TASKS
  80% of assigned tasks completed
  No more than 2 overdue tasks at once

POINTS
  Minimum 150pts per semester

WARNINGS
  Week 8:  below 150pts → notification + leadership check-in
  Week 12: below 75pts → leadership review → possible inactive

INACTIVE STATUS
  Loses access to tasks + merch
  Retains read-only news + help
  Re-activation: petition to leadership next semester

GRACE POLICY
  1 unexcused absence forgiven automatically per semester
  Medical/personal exceptions reviewed by leadership
  Academic probation → reduced requirements on request

### Member Status
🟢 Active   all requirements on track
🟡 At Risk  below minimums, week 8 warning sent
🔴 Review   week 12 threshold hit, leadership reviewing
⚫ Inactive requirements not met, access restricted

---

## Merch Schedule (Spring 2026)
Mar 18  FLIGHT LINE drops
          Free flight tags (pick up at next meeting)
          Flight jacket order form opens
Mar 25  Flight jacket order deadline
Apr 1   COLLECTIBLES LINE drops
          Patches + pins (rolling, no deadline)
          Stickers + claw clips + mugs (deadline Apr 8)
Apr 8   Stickers + claw clips + mugs deadline
Apr 18  SWEAT LINE drops
          Sweatpants + t-shirts (w/sponsors) + sweatshirts
Apr 25  Sweat line deadline — end of semester

Portal states per item:
  Before opens_at  → locked teaser "drops [date]"
  After opens_at   → live, countdown to closes_at if applicable
  Rolling items    → "Order anytime — processed weekly"
  After closes_at  → "Orders closed"

---

## Slack Integration Touchpoints

AUTOMATED
  Welcome DM on first login
  Check-in confirmation DM after QR scan
  Meeting agenda posted to #general before event
  Week 8 at-risk warning DM to member
  Absence approved/denied DM to member

MANUAL
  Member posts to subteam channel from subteam page
  Leadership posts announcement → mirrors to #general

---

## Google Calendar Integration
Member connects in Settings → Integrations
All CLAWS events auto-added to their Google Calendar
Updates in portal sync back to calendar
Each event: title · time · location · agenda link

---

## Database Schema

### members
id            uuid PK default gen_random_uuid()
email         text unique not null
name          text not null
role          text check (role in
              ('member','leadership','faculty','alumni'))
              default 'member'
subteam       text FK → subteams.slug nullable
active        boolean default true
joined        date default now()
avatar_url    text
bio           text
points        int default 0
streak        int default 0
status        text check (status in
              ('active','at_risk','review','inactive'))
              default 'active'

### subteams
slug          text PK
              values: ar|ai|infrastructure|ux|hardware|
                      research|outreach|content|social
name          text not null
description   text
lead_id       uuid FK → members.id nullable
slack_channel text

### events
id            uuid PK default gen_random_uuid()
title         text not null
type          text check (type in
              ('all_hands','subteam','outreach','milestone'))
subteam       text FK → subteams.slug nullable
date          timestamptz not null
location      text
description   text
agenda        jsonb
qr_token      uuid default gen_random_uuid()
qr_expires    timestamptz
created_by    uuid FK → members.id

### attendance
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id not null
event_id      uuid FK → events.id not null
checked_in    timestamptz default now()
method        text check (method in ('qr','manual'))
excused       boolean default false
note          text
unique        (member_id, event_id)

### absence_requests
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id not null
event_id      uuid FK → events.id not null
reason        text
status        text check (status in
              ('pending','approved','denied'))
              default 'pending'
reviewed_by   uuid FK → members.id nullable
created_at    timestamptz default now()

### tasks
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id nullable
subteam       text FK → subteams.slug nullable
title         text not null
description   text
due_date      date
completed     boolean default false
completed_at  timestamptz
assigned_by   uuid FK → members.id not null
points_value  int default 15

### badges
slug          text PK
label         text not null
description   text
icon          text
points        int default 0

### member_badges
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id not null
badge_slug    text FK → badges.slug not null
earned_at     timestamptz default now()
unique        (member_id, badge_slug)

### drive_links
id            uuid PK default gen_random_uuid()
label         text not null
url           text not null
role_required text check (role_required in
              ('member','leadership','faculty'))
subteam       text FK → subteams.slug nullable
category      text
sort_order    int default 0

### merch_items
id            uuid PK default gen_random_uuid()
name          text not null
slug          text unique not null
photo_url     text
line          text check (line in
              ('flight','collectibles','sweat'))
order_type    text check (order_type in
              ('form','free','rolling'))
opens_at      timestamptz not null
closes_at     timestamptz nullable
sizes         text[]
active        boolean default true
google_form_url text

### merch_orders
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id not null
item_id       uuid FK → merch_items.id not null
size          text
quantity      int default 1
notes         text
submitted     timestamptz default now()
status        text check (status in ('pending','fulfilled'))
              default 'pending'

### flight_tag_claims
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id unique not null
claimed_at    timestamptz default now()
picked_up     boolean default false
marked_by     uuid FK → members.id nullable

### news_posts
id            uuid PK default gen_random_uuid()
title         text not null
body          text not null
image_url     text
author_id     uuid FK → members.id not null
created_at    timestamptz default now()
published     boolean default true

### notifications
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id not null
type          text check (type in ('task','attendance',
              'badge','announcement','absence',
              'streak','warning'))
message       text not null
read          boolean default false
created_at    timestamptz default now()

### faqs
id            uuid PK default gen_random_uuid()
question      text not null
answer        text not null
page          text check (page in ('about','team','join'))
sort_order    int default 0

### spotlights
id            uuid PK default gen_random_uuid()
member_id     uuid FK → members.id not null
reason        text not null
created_by    uuid FK → members.id not null
created_at    timestamptz default now()
active        boolean default true

---

## Supabase Storage Buckets
avatars/      private — RLS protected — {member_id}.jpg
merch/        public — {item_slug}.jpg
news/         public — {post_id}.jpg
public/       public — team-photo.jpg · gallery/ · sponsors/

---

## Row Level Security

members
  SELECT: all authenticated users can read active members
  UPDATE: own row (name, bio, avatar_url only)
          leadership: all fields on any row
  INSERT: service role only (first login API route)

tasks
  SELECT: own tasks · subteam lead (own subteam) · leadership
  UPDATE: own (completed + completed_at) · leadership (all)
  INSERT: leadership · subteam lead (own subteam only)

attendance
  SELECT: own · subteam lead (own subteam) · leadership · faculty
  INSERT: service role (QR API) · leadership · subteam lead
  UPDATE: leadership · subteam lead (excused + note only)

absence_requests
  SELECT: own · subteam lead (own subteam) · leadership
  INSERT: member (own rows only)
  UPDATE: leadership · subteam lead (status only, own subteam)

drive_links
  SELECT: authenticated, role_required <= current user role
  INSERT/UPDATE/DELETE: leadership only

merch_items
  SELECT: all authenticated members
  INSERT/UPDATE/DELETE: leadership only

merch_orders
  SELECT: own · leadership
  INSERT: own
  UPDATE: leadership (status only)

flight_tag_claims
  SELECT: own · leadership
  INSERT: own (once per member — unique constraint)
  UPDATE: leadership (picked_up + marked_by only)

news_posts
  SELECT: all authenticated (published = true)
  INSERT/UPDATE/DELETE: leadership only

notifications
  SELECT: own only
  UPDATE: own (read only)

faqs
  SELECT: public — no auth required
  INSERT/UPDATE/DELETE: leadership only

spotlights
  SELECT: all authenticated (active = true)
  INSERT/UPDATE: leadership only

---

## /lib Structure
/lib/supabase.ts      Supabase browser + server clients, typed queries
/lib/auth.ts          NextAuth config, @umich.edu check, role routing
/lib/engagement.ts    Points award, streak calc, badge logic
/lib/qr.ts            QR token generation + validation
/lib/slack.ts         Slack Web API — DMs + channel posts
/lib/calendar.ts      Google Calendar sync
/lib/merch.ts         Drop date gating, countdown logic
/lib/policy.ts        Membership status calculation

---

## /components Structure
/components/ui/               Button, Card, Badge, Modal,
                              Accordion, Avatar, Countdown,
                              StatusIndicator, ActivityGrid
/components/layout/           Navbar, Footer, Subnav,
                              PortalNav, MobileNav
/components/public/           Public page sections
/components/portal/           Portal page components
/components/portal/dashboard/ Profile card, NASA countdown,
                              task widget, attendance widget,
                              spotlight widget, news widget,
                              events widget, activity feed,
                              drive links widget
/components/portal/manage/    Attendance, Members, Tasks,
                              Merch, News manage components
/components/merch/            MerchCard, Timeline, Countdown,
                              OrderModal, OrderHistory
/components/qr/               QRDisplay, QRScanner

---

## Coding Standards
- Functional components only — no class components
- TypeScript — no `any`
- One component per file
- Tailwind only — no inline styles, no CSS-in-JS
- Next.js <Image> for all images
- All images in /public or Supabase storage — no Framer CDN
- Server components by default
  'use client' only for hooks, browser APIs, interactivity
- All DB queries in /lib/supabase only
- All engagement logic in /lib/engagement.ts only
- All merch schedule logic in /lib/merch.ts only
- Mobile-first throughout — /members/checkin critical on phone

---

## Design
- Match dark space aesthetic of https://claws.engin.umich.edu
- Background: #0a0a0f (deep dark, not pure black)
- Typography: clean white, strong hierarchy
- Public site: cinematic, scroll-driven, full-bleed photography
- Portal: mission control feel — structured, data-forward,
  same palette and typography as public site
- Members should feel they went deeper into the same world
- Framer Motion:
    Scroll animations on public pages
    Page transitions
    Badge unlock celebration animation
    QR check-in success animation
- Mobile-first — dashboard and QR check-in must be excellent
  on phone screens

---

## What NOT To Do
- Do not recreate Framer's triplicate markup
  Use Tailwind responsive classes only
- Do not use Canvas LMS — fully descoped
- Do not build Google Drive API — links open in new tab only
- Do not use class components
- Do not hardcode colors — use tailwind.config.ts tokens
- Do not put DB queries in components — always /lib/supabase
- Do not use `any` in TypeScript
- Do not build drag-and-drop for tasks
- Do not add member tiers or labels to points
- Do not make subroutes tabs — they are real navigable pages
  each with their own URL

---

## Local Development
npx supabase init
npx supabase start
  DB:     localhost:54321
  Studio: localhost:54323
npm run dev
  Site:   localhost:3000

.env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SLACK_BOT_TOKEN=
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=

## Deploy
npx supabase db push
git push → Vercel auto-deploys

---

## Commands
npm run dev          local dev server
npm run build        production build
npm run lint         ESLint
npm run typecheck    tsc --noEmit

---

## Build Order
Hr 1-2
  Scaffold Next.js 14 + TypeScript + Tailwind + Framer Motion
  Install all dependencies
  Initialize Supabase locally
  Full DB schema in supabase/migrations/001_initial.sql
  All tables + constraints + foreign keys + check constraints
  All RLS policies
  All storage buckets
  Full /lib directory with typed stubs
  Full /components directory structure with placeholder files
  tailwind.config.ts with CLAWS design tokens
  .env.local with all keys empty
  Verify npm run dev + npm run typecheck pass clean

Hr 2-4
  Public site — Home all 9 sections
  Public Navbar + Footer
  /about layout.tsx with sticky subnav
  /about — Overview (long scrollable page)
  /about/projects
  /about/subteams
  /about/supporters
  /about/faq

Hr 4-5
  /team layout.tsx with sticky subnav
  /team + all 6 subroutes
  /events layout.tsx + both subroutes
  /join layout.tsx + all 3 subroutes
  All FAQ accordions

Hr 5-6
  NextAuth Google OAuth setup
  @umich.edu domain restriction
  Role-based redirect after login
  First login → Supabase member row creation API route
  Onboarding checklist page
  Slack welcome DM on first login
  middleware.ts protecting all /members routes

Hr 6-7
  Portal nav — avatar top-left + bell + Manage gating
  /members/manage layout.tsx with sticky subnav
  Dashboard — all 7 sections + widgets
  /members/profile + /members/profile/[id]
  /members/settings
  /members/notifications

Hr 7-8
  /members/tasks — all sections + filters
  /members/help — all role-filtered sections + search

Hr 8-9
  /members/merch — full schedule logic
  Drop date gating in /lib/merch.ts
  Countdown timers
  Flight tag claim flow
  Order history

Hr 9-10
  /members/news + Slack mirror
  /members/subteam/[slug] — all 9 subteams
  /members/checkin — QR scanner mobile-optimized
  /api/checkin — QR validation API route
  QR display in Manage → Attendance

Hr 10-11
  /members/manage/attendance
  /members/manage/members
  /members/manage/tasks
  /members/manage/merch
  /members/manage/news

Hr 11-12
  /lib/engagement.ts — full points + streak + badge logic
  /lib/policy.ts — status calculation + week 8/12 warnings
  /lib/slack.ts — all Slack touchpoints
  /lib/calendar.ts — Google Calendar sync
  Framer Motion animations throughout
  Mobile polish — especially checkin + dashboard
  Final typecheck + lint pass
```

---

Now here's the Claude Code prompt — paste this the moment you open your laptop:
```
Read CLAUDE.md fully and carefully before doing anything at all.

Then execute these steps in exact order. Do not skip any step.
Do not build any pages until step 10. Ask nothing — make smart
defaults for anything not explicitly specified.

STEP 1
Scaffold a Next.js 14 project using the App Router with
TypeScript and Tailwind CSS configured exactly per CLAUDE.md.

STEP 2
Install every dependency from the stack section:
framer-motion next-auth @supabase/supabase-js @supabase/ssr
qrcode @types/qrcode html5-qrcode @slack/web-api googleapis

STEP 3
Run npx supabase init then npx supabase start.
Confirm local DB is running on localhost:54321.

STEP 4
Create supabase/migrations/001_initial.sql containing the
complete database schema from CLAUDE.md. Every table, every
column, every data type, every default, every check constraint,
every foreign key, every unique constraint. Seed the subteams
table with all 9 subteam rows: ar, ai, infrastructure, ux,
hardware, research, outreach, content, social. Seed the
merch_items table with all Spring 2026 items and their correct
opens_at and closes_at timestamps. Seed badges with a starter
set: first-checkin, streak-5, streak-10, task-master,
onboarding-complete, spotlight, jsc-attendee.

STEP 5
Create all Supabase storage buckets defined in CLAUDE.md:
avatars (private), merch (public), news (public), public (public).

STEP 6
Write all Row Level Security policies from CLAUDE.md into
the migration file. Enable RLS on every table.

STEP 7
Create tailwind.config.ts with the CLAWS design tokens.
Background: #0a0a0f. Build out a full dark space palette
with appropriate grays, a white typography scale, and
accent colors that match the aesthetic of
https://claws.engin.umich.edu.

STEP 8
Create .env.local with all required environment variable
keys from CLAUDE.md as empty strings.

STEP 9
Create the full /lib directory with typed function signatures
and placeholder implementations for every file:
supabase.ts auth.ts engagement.ts qr.ts slack.ts
calendar.ts merch.ts policy.ts

Create the full /components directory structure with
placeholder files for every component listed in CLAUDE.md.

STEP 10
Create app/layout.tsx — root layout with main Navbar and
Footer. Dark background. Clean white typography. Matches
the aesthetic of https://claws.engin.umich.edu.

Create the section layout files with sticky subnavs:
app/about/layout.tsx — subnav: Overview Projects Subteams
                        Supporters FAQ
app/team/layout.tsx  — subnav: PM Board Subteam-Leads
                        Members Alumni FAQ
app/events/layout.tsx — subnav: News Community
app/join/layout.tsx  — subnav: Apply Contact FAQ
app/members/layout.tsx — portal nav with avatar top-left,
                          Home Tasks Merch Help News,
                          notification bell, Manage tab
                          (gated by role + subteam lead check)
app/members/manage/layout.tsx — manage subnav

STEP 11
Run npm run dev and npm run typecheck.
Fix every error until both pass completely clean.
Do not proceed until this step is green.

Once step 11 is confirmed clean, output a single line:
FOUNDATION COMPLETE — READY TO BUILD PAGES
```

When it outputs that line, paste this second prompt:
```
Foundation is clean. Now build the complete public site
in this exact order per CLAUDE.md:

1. Home — all 9 sections with Framer Motion scroll animations
2. /about — long scrollable overview page
3. /about/projects
4. /about/subteams
5. /about/supporters
6. /about/faq — accordion
7. /team and all 6 subroutes including FAQ accordion
8. /events and both subroutes
9. /join and all 3 subroutes including FAQ accordion

Design must match the dark space aesthetic of
https://claws.engin.umich.edu — deep dark background,
clean white typography, full-bleed photography sections,
generous whitespace. Use placeholder images where real
images are not available. All pages fully responsive
mobile-first. Subnav sticks below main nav, highlights
active subroute, main nav highlights active parent section.

Do not build any /members routes yet.
Run npm run typecheck after each page.
Ask nothing — just build.
```

When the public site is done, paste this third prompt:
```
Public site is done. Now build the complete member portal
in this exact order per CLAUDE.md:

1. Auth — NextAuth Google OAuth, @umich.edu restriction,
   role-based redirect, first login member row creation,
   onboarding checklist, Slack welcome DM,
   middleware.ts protecting all /members routes

2. Portal foundation — Dashboard all 7 sections,
   /members/profile + /members/profile/[id],
   /members/settings, /members/notifications

3. /members/tasks — all sections + filter bar
4. /members/help — all role-filtered sections + search bar
5. /members/merch — full schedule logic from /lib/merch.ts,
   all drop states, countdown timers, flight tag flow
6. /members/news + Slack #announcements mirror
7. /members/subteam/[slug] — all 9 subteams
8. /members/checkin + /api/checkin QR validation route

9. /members/manage and all 5 subroutes —
   attendance with QR display, members roster,
   tasks assignment, merch fulfillment, news posting

10. Wire up all /lib functions —
    engagement.ts points + streak + badges
    policy.ts status calculation + week 8/12 warnings
    slack.ts all touchpoints
    calendar.ts Google Calendar sync

11. Framer Motion — page transitions, badge unlock
    celebration, QR check-in success animation

12. Final pass — npm run typecheck + npm run lint
    Fix everything until both pass clean.

Ask nothing — just build.