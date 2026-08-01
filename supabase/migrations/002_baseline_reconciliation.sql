-- ============================================================
-- BASELINE RECONCILIATION
-- ============================================================
-- Captures schema that already existed live but was never tracked in a
-- migration — built directly via the Supabase dashboard/SQL editor at some
-- point before this file existed. Reverse-engineered from the live project
-- via pg_policies + PostgREST OpenAPI introspection, not guessed — every
-- table, column, policy name, and policy condition below matches what was
-- confirmed live. Safe to run on a fresh project (idempotent throughout);
-- running it again against the current live project is also a no-op.
--
-- Also fixes a real issue found during this reconciliation: a
-- "members_select_public_active" policy (roles: public, no auth required)
-- existed live and exposed every column of active members' rows — including
-- email and phone — to fully unauthenticated requests. It was not in any
-- tracked migration and has already been dropped directly against the live
-- project. Nothing to do here; noted for history. The public `/team` pages
-- that show member info don't need it — they render server-side through the
-- service-role client, which bypasses RLS regardless.

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public) values
  ('site-images', 'site-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('attachments', 'attachments', false, 52428800, array[
    'image/jpeg','image/png','image/gif','image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain','text/csv','application/zip'
  ])
on conflict (id) do nothing;

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists task_attachments (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid not null references tasks(id) on delete cascade,
  member_id   uuid not null references members(id),
  file_name   text not null,
  file_url    text not null,
  file_size   int,
  mime_type   text,
  uploaded_at timestamptz not null default now()
);

create table if not exists channels (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  type        text not null check (type in ('general','subteam','private')),
  subteam     text references subteams(slug),
  created_at  timestamptz not null default now()
);

create table if not exists channel_messages (
  id         uuid primary key default gen_random_uuid(),
  channel_id uuid not null references channels(id) on delete cascade,
  member_id  uuid not null references members(id),
  body       text not null,
  edited_at  timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists dm_threads (
  id           uuid primary key default gen_random_uuid(),
  member_a_id  uuid not null references members(id),
  member_b_id  uuid not null references members(id),
  created_at   timestamptz not null default now(),
  unique (member_a_id, member_b_id),
  check (member_a_id < member_b_id) -- canonical ordering, matches getOrCreateDmThread's sort
);

create table if not exists dm_messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references dm_threads(id) on delete cascade,
  sender_id  uuid not null references members(id),
  body       text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists gallery_photos (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  caption    text,
  category   text,
  sort_order int default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists supporters (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text,
  logo_url   text,
  website    text,
  tier       text,
  bio        text,
  sort_order int default 0,
  active     boolean not null default true
);

create index if not exists task_attachments_task_id_idx on task_attachments (task_id);
create index if not exists channel_messages_channel_id_created_at_idx on channel_messages (channel_id, created_at);
create index if not exists dm_threads_member_a_id_idx on dm_threads (member_a_id);
create index if not exists dm_threads_member_b_id_idx on dm_threads (member_b_id);
create index if not exists dm_messages_thread_id_created_at_idx on dm_messages (thread_id, created_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table task_attachments enable row level security;
alter table channels         enable row level security;
alter table channel_messages enable row level security;
alter table dm_threads       enable row level security;
alter table dm_messages      enable row level security;
alter table gallery_photos   enable row level security;
alter table supporters       enable row level security;

-- ============================================================
-- RLS POLICIES — task_attachments
-- (live names/logic — note these are `public`-role policies that stay safe
-- because every qual/with_check keys off auth.uid(), which is NULL for an
-- unauthenticated request and so never matches)
-- ============================================================

drop policy if exists "view task attachments" on task_attachments;
create policy "view task attachments"
  on task_attachments for select
  using (
    exists (select 1 from tasks where tasks.id = task_attachments.task_id and tasks.member_id = auth.uid())
    or exists (select 1 from members where members.id = auth.uid() and members.role = any (array['leadership','faculty']))
    or exists (
      select 1 from tasks t join subteams s on s.slug = t.subteam
      where t.id = task_attachments.task_id and s.lead_id = auth.uid()
    )
  );

drop policy if exists "insert own task attachments" on task_attachments;
create policy "insert own task attachments"
  on task_attachments for insert
  with check (
    member_id = auth.uid()
    and (
      exists (select 1 from tasks where tasks.id = task_attachments.task_id and tasks.member_id = auth.uid())
      or exists (select 1 from members where members.id = auth.uid() and members.role = 'leadership')
    )
  );

drop policy if exists "delete task attachments" on task_attachments;
create policy "delete task attachments"
  on task_attachments for delete
  using (
    member_id = auth.uid()
    or exists (select 1 from members where members.id = auth.uid() and members.role = 'leadership')
  );

-- ============================================================
-- RLS POLICIES — channels
-- ============================================================

drop policy if exists "channels_select" on channels;
create policy "channels_select"
  on channels for select to authenticated
  using (true);

drop policy if exists "channels_insert" on channels;
create policy "channels_insert"
  on channels for insert to authenticated
  with check (exists (select 1 from members where members.id = auth.uid() and members.role = 'leadership'));

-- ============================================================
-- RLS POLICIES — channel_messages
-- ============================================================

drop policy if exists "channel_messages_select" on channel_messages;
create policy "channel_messages_select"
  on channel_messages for select to authenticated
  using (true);

drop policy if exists "channel_messages_insert" on channel_messages;
create policy "channel_messages_insert"
  on channel_messages for insert to authenticated
  with check (member_id = auth.uid());

drop policy if exists "channel_messages_update" on channel_messages;
create policy "channel_messages_update"
  on channel_messages for update to authenticated
  using (member_id = auth.uid())
  with check (member_id = auth.uid());

drop policy if exists "channel_messages_delete" on channel_messages;
create policy "channel_messages_delete"
  on channel_messages for delete to authenticated
  using (
    member_id = auth.uid()
    or exists (select 1 from members where members.id = auth.uid() and members.role = 'leadership')
  );

-- ============================================================
-- RLS POLICIES — dm_threads
-- ============================================================

drop policy if exists "dm_threads_select" on dm_threads;
create policy "dm_threads_select"
  on dm_threads for select to authenticated
  using (member_a_id = auth.uid() or member_b_id = auth.uid());

drop policy if exists "dm_threads_insert" on dm_threads;
create policy "dm_threads_insert"
  on dm_threads for insert to authenticated
  with check (member_a_id = auth.uid() or member_b_id = auth.uid());

-- ============================================================
-- RLS POLICIES — dm_messages
-- ============================================================

drop policy if exists "dm_messages_select" on dm_messages;
create policy "dm_messages_select"
  on dm_messages for select to authenticated
  using (
    exists (
      select 1 from dm_threads
      where dm_threads.id = dm_messages.thread_id
        and (dm_threads.member_a_id = auth.uid() or dm_threads.member_b_id = auth.uid())
    )
  );

drop policy if exists "dm_messages_insert" on dm_messages;
create policy "dm_messages_insert"
  on dm_messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from dm_threads
      where dm_threads.id = dm_messages.thread_id
        and (dm_threads.member_a_id = auth.uid() or dm_threads.member_b_id = auth.uid())
    )
  );

drop policy if exists "dm_messages_update" on dm_messages;
create policy "dm_messages_update"
  on dm_messages for update to authenticated
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- ============================================================
-- RLS POLICIES — gallery_photos
-- ============================================================

drop policy if exists "gallery_select_public" on gallery_photos;
create policy "gallery_select_public"
  on gallery_photos for select
  using (active = true);

drop policy if exists "gallery_insert_leadership" on gallery_photos;
create policy "gallery_insert_leadership"
  on gallery_photos for insert to authenticated
  with check (auth_role() = 'leadership');

drop policy if exists "gallery_delete_leadership" on gallery_photos;
create policy "gallery_delete_leadership"
  on gallery_photos for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — supporters
-- (select-only live — managed via service role, no app-level write path)
-- ============================================================

drop policy if exists "supporters_select_public" on supporters;
create policy "supporters_select_public"
  on supporters for select
  using (active = true);
