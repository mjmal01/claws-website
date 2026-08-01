-- ============================================================
-- CLAWS Website — Initial Schema
-- 001_initial.sql
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- subteams (no FK deps — define first)
create table subteams (
  slug          text primary key check (slug in (
                  'ar','ai','infrastructure','ux','hardware',
                  'research','outreach','content','social')),
  name          text not null,
  description   text,
  lead_id       uuid,  -- FK added after members table
  slack_channel text
);

-- members
create table members (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  name          text not null,
  role          text not null default 'member'
                  check (role in ('member','leadership','faculty','alumni')),
  subteam       text references subteams(slug) on delete set null,
  active        boolean not null default true,
  joined        date not null default now(),
  avatar_url    text,
  bio           text,
  points        int not null default 0,
  streak        int not null default 0,
  status        text not null default 'active'
                  check (status in ('active','at_risk','review','inactive'))
);

-- add FK from subteams.lead_id now that members exists
alter table subteams
  add constraint subteams_lead_id_fkey
  foreign key (lead_id) references members(id) on delete set null;

-- events
create table events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  type          text not null
                  check (type in ('all_hands','subteam','outreach','milestone')),
  subteam       text references subteams(slug) on delete set null,
  date          timestamptz not null,
  location      text,
  description   text,
  agenda        jsonb,
  qr_token      uuid not null default gen_random_uuid(),
  qr_expires    timestamptz,
  created_by    uuid references members(id) on delete set null
);

-- attendance
create table attendance (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members(id) on delete cascade,
  event_id      uuid not null references events(id) on delete cascade,
  checked_in    timestamptz not null default now(),
  method        text not null check (method in ('qr','manual')),
  excused       boolean not null default false,
  note          text,
  unique (member_id, event_id)
);

-- absence_requests
create table absence_requests (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members(id) on delete cascade,
  event_id      uuid not null references events(id) on delete cascade,
  reason        text,
  status        text not null default 'pending'
                  check (status in ('pending','approved','denied')),
  reviewed_by   uuid references members(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- tasks
create table tasks (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid references members(id) on delete cascade,
  subteam       text references subteams(slug) on delete set null,
  title         text not null,
  description   text,
  due_date      date,
  completed     boolean not null default false,
  completed_at  timestamptz,
  assigned_by   uuid not null references members(id) on delete restrict,
  points_value  int not null default 15
);

-- badges
create table badges (
  slug          text primary key,
  label         text not null,
  description   text,
  icon          text,
  points        int not null default 0
);

-- member_badges
create table member_badges (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members(id) on delete cascade,
  badge_slug    text not null references badges(slug) on delete cascade,
  earned_at     timestamptz not null default now(),
  unique (member_id, badge_slug)
);

-- drive_links
create table drive_links (
  id            uuid primary key default gen_random_uuid(),
  label         text not null,
  url           text not null,
  role_required text check (role_required in ('member','leadership','faculty')),
  subteam       text references subteams(slug) on delete set null,
  category      text,
  sort_order    int not null default 0
);

-- merch_items
create table merch_items (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text unique not null,
  photo_url       text,
  line            text not null check (line in ('flight','collectibles','sweat')),
  order_type      text not null check (order_type in ('form','free','rolling')),
  opens_at        timestamptz not null,
  closes_at       timestamptz,
  sizes           text[],
  active          boolean not null default true,
  google_form_url text
);

-- merch_orders
create table merch_orders (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  item_id     uuid not null references merch_items(id) on delete restrict,
  size        text,
  quantity    int not null default 1,
  notes       text,
  submitted   timestamptz not null default now(),
  status      text not null default 'pending'
                check (status in ('pending','fulfilled'))
);

-- flight_tag_claims
create table flight_tag_claims (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid unique not null references members(id) on delete cascade,
  claimed_at  timestamptz not null default now(),
  picked_up   boolean not null default false,
  marked_by   uuid references members(id) on delete set null
);

-- news_posts
create table news_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  image_url   text,
  author_id   uuid not null references members(id) on delete restrict,
  created_at  timestamptz not null default now(),
  published   boolean not null default true
);

-- notifications
create table notifications (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  type        text not null
                check (type in ('task','attendance','badge','announcement',
                                'absence','streak','warning')),
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- faqs
create table faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  page        text not null check (page in ('about','team','join')),
  sort_order  int not null default 0
);

-- spotlights
create table spotlights (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  reason      text not null,
  created_by  uuid not null references members(id) on delete restrict,
  created_at  timestamptz not null default now(),
  active      boolean not null default true
);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', false),
  ('merch',   'merch',   true),
  ('news',    'news',    true),
  ('public',  'public',  true)
on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table members           enable row level security;
alter table subteams          enable row level security;
alter table events            enable row level security;
alter table attendance        enable row level security;
alter table absence_requests  enable row level security;
alter table tasks             enable row level security;
alter table badges            enable row level security;
alter table member_badges     enable row level security;
alter table drive_links       enable row level security;
alter table merch_items       enable row level security;
alter table merch_orders      enable row level security;
alter table flight_tag_claims enable row level security;
alter table news_posts        enable row level security;
alter table notifications     enable row level security;
alter table faqs              enable row level security;
alter table spotlights        enable row level security;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

create or replace function auth_role()
returns text language sql security definer stable as $$
  select role from members where id = auth.uid()
$$;

create or replace function auth_subteam()
returns text language sql security definer stable as $$
  select subteam from members where id = auth.uid()
$$;

create or replace function is_subteam_lead(p_slug text)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from subteams where slug = p_slug and lead_id = auth.uid()
  )
$$;

-- ============================================================
-- RLS POLICIES — members
-- ============================================================

create policy "members_select_active"
  on members for select to authenticated
  using (active = true);

create policy "members_select_own"
  on members for select to authenticated
  using (id = auth.uid());

create policy "members_select_leadership"
  on members for select to authenticated
  using (auth_role() in ('leadership','faculty'));

create policy "members_update_own"
  on members for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "members_update_leadership"
  on members for update to authenticated
  using (auth_role() = 'leadership');

create policy "members_insert_service"
  on members for insert to service_role
  with check (true);

-- ============================================================
-- RLS POLICIES — subteams
-- ============================================================

create policy "subteams_select_all"
  on subteams for select to authenticated
  using (true);

create policy "subteams_insert_leadership"
  on subteams for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "subteams_update_leadership"
  on subteams for update to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — events
-- ============================================================

create policy "events_select_authenticated"
  on events for select to authenticated
  using (true);

create policy "events_insert_leadership_or_lead"
  on events for insert to authenticated
  with check (auth_role() = 'leadership' or is_subteam_lead(subteam));

create policy "events_update_leadership_or_lead"
  on events for update to authenticated
  using (auth_role() = 'leadership' or is_subteam_lead(subteam));

-- ============================================================
-- RLS POLICIES — attendance
-- ============================================================

create policy "attendance_select_own"
  on attendance for select to authenticated
  using (member_id = auth.uid());

create policy "attendance_select_lead"
  on attendance for select to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = event_id and is_subteam_lead(e.subteam)
    )
  );

create policy "attendance_select_leadership_faculty"
  on attendance for select to authenticated
  using (auth_role() in ('leadership','faculty'));

create policy "attendance_insert_service"
  on attendance for insert to service_role
  with check (true);

create policy "attendance_insert_leadership_or_lead"
  on attendance for insert to authenticated
  with check (
    auth_role() = 'leadership'
    or exists (
      select 1 from events e
      where e.id = event_id and is_subteam_lead(e.subteam)
    )
  );

create policy "attendance_update_leadership_or_lead"
  on attendance for update to authenticated
  using (
    auth_role() = 'leadership'
    or exists (
      select 1 from events e
      where e.id = event_id and is_subteam_lead(e.subteam)
    )
  );

-- ============================================================
-- RLS POLICIES — absence_requests
-- ============================================================

create policy "absence_select_own"
  on absence_requests for select to authenticated
  using (member_id = auth.uid());

create policy "absence_select_lead"
  on absence_requests for select to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = event_id and is_subteam_lead(e.subteam)
    )
  );

create policy "absence_select_leadership"
  on absence_requests for select to authenticated
  using (auth_role() = 'leadership');

create policy "absence_insert_own"
  on absence_requests for insert to authenticated
  with check (member_id = auth.uid());

create policy "absence_update_leadership"
  on absence_requests for update to authenticated
  using (auth_role() = 'leadership');

create policy "absence_update_lead"
  on absence_requests for update to authenticated
  using (
    exists (
      select 1 from events e
      where e.id = event_id and is_subteam_lead(e.subteam)
    )
  );

-- ============================================================
-- RLS POLICIES — tasks
-- ============================================================

create policy "tasks_select_own"
  on tasks for select to authenticated
  using (member_id = auth.uid());

create policy "tasks_select_lead"
  on tasks for select to authenticated
  using (subteam is not null and is_subteam_lead(subteam));

create policy "tasks_select_leadership"
  on tasks for select to authenticated
  using (auth_role() = 'leadership');

create policy "tasks_update_own"
  on tasks for update to authenticated
  using (member_id = auth.uid());

create policy "tasks_update_leadership"
  on tasks for update to authenticated
  using (auth_role() = 'leadership');

create policy "tasks_insert_leadership"
  on tasks for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "tasks_insert_lead"
  on tasks for insert to authenticated
  with check (subteam is not null and is_subteam_lead(subteam));

-- ============================================================
-- RLS POLICIES — badges
-- ============================================================

create policy "badges_select_authenticated"
  on badges for select to authenticated
  using (true);

create policy "badges_insert_leadership"
  on badges for insert to authenticated
  with check (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — member_badges
-- ============================================================

create policy "member_badges_select_authenticated"
  on member_badges for select to authenticated
  using (true);

create policy "member_badges_insert_service"
  on member_badges for insert to service_role
  with check (true);

-- ============================================================
-- RLS POLICIES — drive_links
-- ============================================================

create policy "drive_links_select_authenticated"
  on drive_links for select to authenticated
  using (true);

create policy "drive_links_insert_leadership"
  on drive_links for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "drive_links_update_leadership"
  on drive_links for update to authenticated
  using (auth_role() = 'leadership');

create policy "drive_links_delete_leadership"
  on drive_links for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — merch_items
-- ============================================================

create policy "merch_items_select_authenticated"
  on merch_items for select to authenticated
  using (true);

create policy "merch_items_insert_leadership"
  on merch_items for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "merch_items_update_leadership"
  on merch_items for update to authenticated
  using (auth_role() = 'leadership');

create policy "merch_items_delete_leadership"
  on merch_items for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — merch_orders
-- ============================================================

create policy "merch_orders_select_own"
  on merch_orders for select to authenticated
  using (member_id = auth.uid());

create policy "merch_orders_select_leadership"
  on merch_orders for select to authenticated
  using (auth_role() = 'leadership');

create policy "merch_orders_insert_own"
  on merch_orders for insert to authenticated
  with check (member_id = auth.uid());

create policy "merch_orders_update_leadership"
  on merch_orders for update to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — flight_tag_claims
-- ============================================================

create policy "flight_tag_select_own"
  on flight_tag_claims for select to authenticated
  using (member_id = auth.uid());

create policy "flight_tag_select_leadership"
  on flight_tag_claims for select to authenticated
  using (auth_role() = 'leadership');

create policy "flight_tag_insert_own"
  on flight_tag_claims for insert to authenticated
  with check (member_id = auth.uid());

create policy "flight_tag_update_leadership"
  on flight_tag_claims for update to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — news_posts
-- ============================================================

create policy "news_select_published"
  on news_posts for select to authenticated
  using (published = true);

create policy "news_insert_leadership"
  on news_posts for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "news_update_leadership"
  on news_posts for update to authenticated
  using (auth_role() = 'leadership');

create policy "news_delete_leadership"
  on news_posts for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — notifications
-- ============================================================

create policy "notifications_select_own"
  on notifications for select to authenticated
  using (member_id = auth.uid());

create policy "notifications_update_own"
  on notifications for update to authenticated
  using (member_id = auth.uid());

create policy "notifications_insert_service"
  on notifications for insert to service_role
  with check (true);

-- ============================================================
-- RLS POLICIES — faqs (public read)
-- ============================================================

create policy "faqs_select_public"
  on faqs for select
  using (true);

create policy "faqs_insert_leadership"
  on faqs for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "faqs_update_leadership"
  on faqs for update to authenticated
  using (auth_role() = 'leadership');

create policy "faqs_delete_leadership"
  on faqs for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — spotlights
-- ============================================================

create policy "spotlights_select_active"
  on spotlights for select to authenticated
  using (active = true);

create policy "spotlights_insert_leadership"
  on spotlights for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "spotlights_update_leadership"
  on spotlights for update to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — storage
-- ============================================================

create policy "avatars_select_own"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_insert_own"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_update_own"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "merch_public_select"
  on storage.objects for select
  using (bucket_id = 'merch');

create policy "news_public_select"
  on storage.objects for select
  using (bucket_id = 'news');

create policy "public_bucket_select"
  on storage.objects for select
  using (bucket_id = 'public');

create policy "merch_leadership_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'merch' and auth_role() = 'leadership');

create policy "news_leadership_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'news' and auth_role() = 'leadership');

create policy "public_leadership_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'public' and auth_role() = 'leadership');

-- ============================================================
-- SEED — Subteams
-- ============================================================

insert into subteams (slug, name, description, slack_channel) values
  ('ar',             'AR',             'Augmented reality interfaces for the NASA SUITS challenge', '#ar'),
  ('ai',             'AI',             'Machine learning and AI systems for space applications', '#ai'),
  ('infrastructure', 'Infrastructure', 'Software infrastructure, DevOps, and systems architecture', '#infrastructure'),
  ('ux',             'UX',             'User experience design and research across all CLAWS products', '#ux'),
  ('hardware',       'Hardware',       'Physical prototyping, electronics, and hardware integration', '#hardware'),
  ('research',       'Research',       'Academic research, literature review, and technical analysis', '#research'),
  ('outreach',       'Outreach',       'Community engagement, K-12 education, and public relations', '#outreach'),
  ('content',        'Content',        'Video production, photography, and multimedia storytelling', '#content'),
  ('social',         'Social',         'Social media strategy, branding, and online presence', '#social')
on conflict (slug) do nothing;

-- ============================================================
-- SEED — Badges
-- ============================================================

insert into badges (slug, label, description, icon, points) values
  ('first-checkin',       'First Check-in',     'Scanned your first QR code at a CLAWS event',   '🚀', 25),
  ('streak-5',            '5-Week Streak',      'Attended 5 consecutive weeks of meetings',       '🔥', 30),
  ('streak-10',           '10-Week Streak',     'Attended 10 consecutive weeks of meetings',      '⚡', 75),
  ('task-master',         'Task Master',        'Completed 10 tasks on time',                     '✅', 20),
  ('onboarding-complete', 'Onboarding Complete','Finished all onboarding checklist items',        '🎓', 50),
  ('spotlight',           'Member Spotlight',   'Featured as a CLAWS member spotlight',           '⭐', 40),
  ('jsc-attendee',        'JSC Attendee',       'Attended NASA Johnson Space Center competition', '🏆', 100)
on conflict (slug) do nothing;

-- ============================================================
-- SEED — Merch Items (Spring 2026)
-- ============================================================

insert into merch_items (name, slug, line, order_type, opens_at, closes_at, sizes, active) values
  ('Flight Tag',   'flight-tag',    'flight',      'free',    '2026-03-18 00:00:00+00', null,                    null,                                    true),
  ('Flight Jacket','flight-jacket', 'flight',      'form',    '2026-03-18 00:00:00+00','2026-03-25 23:59:59+00', array['XS','S','M','L','XL','2XL'],      true),
  ('Patches',      'patches',       'collectibles','rolling', '2026-04-01 00:00:00+00', null,                    null,                                    true),
  ('Pins',         'pins',          'collectibles','rolling', '2026-04-01 00:00:00+00', null,                    null,                                    true),
  ('Stickers',     'stickers',      'collectibles','form',    '2026-04-01 00:00:00+00','2026-04-08 23:59:59+00', null,                                    true),
  ('Claw Clips',   'claw-clips',    'collectibles','form',    '2026-04-01 00:00:00+00','2026-04-08 23:59:59+00', null,                                    true),
  ('Mugs',         'mugs',          'collectibles','form',    '2026-04-01 00:00:00+00','2026-04-08 23:59:59+00', null,                                    true),
  ('Sweatpants',   'sweatpants',    'sweat',       'form',    '2026-04-18 00:00:00+00','2026-04-25 23:59:59+00', array['XS','S','M','L','XL','2XL'],      true),
  ('T-Shirts',     't-shirts',      'sweat',       'form',    '2026-04-18 00:00:00+00','2026-04-25 23:59:59+00', array['XS','S','M','L','XL','2XL'],      true),
  ('Sweatshirts',  'sweatshirts',   'sweat',       'form',    '2026-04-18 00:00:00+00','2026-04-25 23:59:59+00', array['XS','S','M','L','XL','2XL'],      true)
on conflict (slug) do nothing;

-- ============================================================
-- SEED — FAQs
-- ============================================================

insert into faqs (question, answer, page, sort_order) values
  ('What is CLAWS?', 'CLAWS (Collaborative Lab for Advancing Work in Space) is a University of Michigan student organization focused on developing innovative technology for NASA space exploration challenges, including the SUITS and RASC-AL competitions.', 'about', 1),
  ('What is the NASA SUITS challenge?', 'NASA SUITS (Spacesuit User Interface Technologies for Students) is a challenge where student teams design and build spacesuit interface prototypes that are tested at NASA''s Johnson Space Center.', 'about', 2),
  ('What is the NASA RASC-AL challenge?', 'RASC-AL (Revolutionary Aerospace Systems Concepts - Academic Linkage) is a NASA challenge where student teams propose innovative concepts for human space exploration missions.', 'about', 3),
  ('What subteams can I join?', 'CLAWS has nine subteams: AR, AI, Infrastructure, UX, Hardware, Research, Outreach, Content, and Social. Each subteam contributes to our mission in a unique way.', 'about', 4),
  ('Do I need experience to join?', 'No prior experience is required. We welcome students of all skill levels and backgrounds. What matters most is enthusiasm, curiosity, and commitment.', 'about', 5),
  ('When does recruitment happen?', 'CLAWS recruits at the beginning of each semester. Applications open in late August for fall and early January for spring.', 'about', 6),
  ('How much time does it take per week?', 'Expect to commit around 4-6 hours per week including subteam meetings, all-hands meetings, and project work.', 'about', 7),
  ('Is CLAWS open to all majors?', 'Absolutely. While many members study engineering or computer science, we value diverse perspectives and actively recruit students from all academic backgrounds.', 'about', 8),
  ('How do I get involved as a sponsor?', 'Reach out to us at claws-admin@umich.edu or visit the Supporters page to learn about partnership opportunities.', 'about', 9),
  ('How is the team structured?', 'CLAWS is led by a President and board, supported by nine subteam leads and faculty advisors. Subteam leads manage their respective teams and report to the board.', 'team', 1),
  ('How do subteam leads get selected?', 'Subteam leads are selected by the board at the end of each academic year based on demonstrated leadership, technical skill, and commitment to CLAWS'' mission.', 'team', 2),
  ('What does the board do?', 'The board handles org-wide strategy, recruitment, sponsorships, competition logistics, and ensures all subteams have the resources they need to succeed.', 'team', 3),
  ('Can I switch subteams mid-year?', 'Subteam changes are evaluated case by case. Reach out to your subteam lead and the board if you feel another subteam would be a better fit.', 'team', 4),
  ('Who are the faculty advisors?', 'CLAWS is supported by faculty advisors from the College of Engineering who provide academic guidance, mentorship, and help us navigate university resources.', 'team', 5),
  ('When does recruitment open?', 'Recruitment opens at the start of each semester - typically late August for fall and early January for spring.', 'join', 1),
  ('Is there an interview process?', 'Yes. After submitting an application, selected candidates are invited to an interview with subteam leads and board members.', 'join', 2),
  ('Can freshmen apply?', 'Yes! We actively welcome first-year students. Your enthusiasm and fresh perspective are just as valuable as technical experience.', 'join', 3),
  ('Can grad students apply?', 'Yes. Graduate students are welcome and often bring valuable research and technical expertise to CLAWS.', 'join', 4),
  ('What subteam should I apply to?', 'Apply to the subteam that best aligns with your skills and interests. Our subteam descriptions on the About page can help you decide.', 'join', 5),
  ('Can I apply to multiple subteams?', 'You may indicate interest in multiple subteams on your application, but you will be placed on one subteam to ensure focused contribution.', 'join', 6),
  ('What happens after I apply?', 'You will receive a confirmation email. If selected, you will be invited to interview within 1-2 weeks of the application deadline.', 'join', 7),
  ('Is there a GPA requirement?', 'There is no minimum GPA requirement. We evaluate applicants holistically based on passion, commitment, and fit.', 'join', 8)
on conflict do nothing;
