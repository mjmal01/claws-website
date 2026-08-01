-- ============================================================
-- MESSAGING + TASK ATTACHMENTS
-- ============================================================
-- These tables are queried throughout the app (lib/supabase.ts,
-- app/actions/messages.ts, app/members/messages/*, task attachment
-- upload in ManageTasksClient.tsx) but were absent from 001_initial.sql.
-- NOTE: before applying this migration, run `supabase db diff` against
-- the live project — these tables may already exist via dashboard-created
-- SQL (schema drift). Reconcile column/policy differences rather than
-- applying blind if so.

-- ============================================================
-- STORAGE BUCKET — attachments
-- ============================================================
-- Public, matching the merch/news/public bucket pattern already in use —
-- ManageTasksClient.tsx calls storage.from('attachments').getPublicUrl(),
-- which only returns a usable URL for a public bucket. Access to the page
-- itself is already gated by NextAuth + the manage-routes role check; RLS
-- below still restricts who can upload/read the underlying rows.

insert into storage.buckets (id, name, public) values
  ('attachments', 'attachments', true)
on conflict (id) do nothing;

-- ============================================================
-- TABLES
-- ============================================================

create table task_attachments (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid not null references tasks(id) on delete cascade,
  member_id   uuid not null references members(id),
  file_name   text not null,
  file_url    text not null,
  file_size   int,
  mime_type   text,
  uploaded_at timestamptz not null default now()
);

-- DRAFT — messaging is actively being built out and its permission model
-- isn't settled yet (confirmed with the user: this was never actually set
-- up before). The tables below and their RLS policies are a reasonable
-- starting skeleton (open channel read, leadership-only channel admin,
-- participant-only DMs) — treat as a placeholder to revise once the real
-- channel/permission requirements are defined, not as ready-to-apply.
-- task_attachments above is unaffected by this — it mirrors the existing,
-- already-settled task visibility rules.

create table channels (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  type        text not null check (type in ('general','subteam','private')),
  subteam     text references subteams(slug),
  created_at  timestamptz not null default now()
);

create table channel_messages (
  id         uuid primary key default gen_random_uuid(),
  channel_id uuid not null references channels(id) on delete cascade,
  member_id  uuid not null references members(id),
  body       text not null,
  edited_at  timestamptz,
  created_at timestamptz not null default now()
);

create table dm_threads (
  id           uuid primary key default gen_random_uuid(),
  member_a_id  uuid not null references members(id),
  member_b_id  uuid not null references members(id),
  created_at   timestamptz not null default now(),
  unique (member_a_id, member_b_id),
  check (member_a_id < member_b_id) -- canonical ordering, matches getOrCreateDmThread's sort
);

create table dm_messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references dm_threads(id) on delete cascade,
  sender_id  uuid not null references members(id),
  body       text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index on task_attachments (task_id);
create index on channel_messages (channel_id, created_at);
create index on dm_threads (member_a_id);
create index on dm_threads (member_b_id);
create index on dm_messages (thread_id, created_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table task_attachments enable row level security;
alter table channels         enable row level security;
alter table channel_messages enable row level security;
alter table dm_threads       enable row level security;
alter table dm_messages      enable row level security;

-- ============================================================
-- RLS POLICIES — task_attachments
-- ============================================================
-- Visibility mirrors the underlying task's own visibility (tasks_select_*
-- in 001_initial.sql): own task, own-subteam lead, or leadership.

create policy "task_attachments_select"
  on task_attachments for select to authenticated
  using (
    exists (
      select 1 from tasks t
      where t.id = task_id
        and (
          t.member_id = auth.uid()
          or (t.subteam is not null and is_subteam_lead(t.subteam))
          or auth_role() = 'leadership'
        )
    )
  );

create policy "task_attachments_insert"
  on task_attachments for insert to authenticated
  with check (
    member_id = auth.uid()
    and exists (
      select 1 from tasks t
      where t.id = task_id
        and (
          t.member_id = auth.uid()
          or (t.subteam is not null and is_subteam_lead(t.subteam))
          or auth_role() = 'leadership'
        )
    )
  );

create policy "task_attachments_delete_own"
  on task_attachments for delete to authenticated
  using (member_id = auth.uid());

create policy "task_attachments_delete_leadership"
  on task_attachments for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — channels
-- ============================================================
-- Open read to match current app behavior (getChannels() does not filter
-- by subteam membership) — administrative writes are leadership-only.

create policy "channels_select_authenticated"
  on channels for select to authenticated
  using (true);

create policy "channels_insert_leadership"
  on channels for insert to authenticated
  with check (auth_role() = 'leadership');

create policy "channels_update_leadership"
  on channels for update to authenticated
  using (auth_role() = 'leadership');

create policy "channels_delete_leadership"
  on channels for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — channel_messages
-- ============================================================

create policy "channel_messages_select_authenticated"
  on channel_messages for select to authenticated
  using (true);

create policy "channel_messages_insert_own"
  on channel_messages for insert to authenticated
  with check (member_id = auth.uid());

create policy "channel_messages_update_own"
  on channel_messages for update to authenticated
  using (member_id = auth.uid());

create policy "channel_messages_delete_own"
  on channel_messages for delete to authenticated
  using (member_id = auth.uid());

create policy "channel_messages_delete_leadership"
  on channel_messages for delete to authenticated
  using (auth_role() = 'leadership');

-- ============================================================
-- RLS POLICIES — dm_threads
-- ============================================================

create policy "dm_threads_select_participant"
  on dm_threads for select to authenticated
  using (member_a_id = auth.uid() or member_b_id = auth.uid());

create policy "dm_threads_insert_participant"
  on dm_threads for insert to authenticated
  with check (member_a_id = auth.uid() or member_b_id = auth.uid());

-- ============================================================
-- RLS POLICIES — dm_messages
-- ============================================================

create policy "dm_messages_select_participant"
  on dm_messages for select to authenticated
  using (
    exists (
      select 1 from dm_threads t
      where t.id = thread_id
        and (t.member_a_id = auth.uid() or t.member_b_id = auth.uid())
    )
  );

create policy "dm_messages_insert_participant"
  on dm_messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from dm_threads t
      where t.id = thread_id
        and (t.member_a_id = auth.uid() or t.member_b_id = auth.uid())
    )
  );

create policy "dm_messages_update_participant"
  on dm_messages for update to authenticated
  using (
    exists (
      select 1 from dm_threads t
      where t.id = thread_id
        and (t.member_a_id = auth.uid() or t.member_b_id = auth.uid())
    )
  );

-- ============================================================
-- RLS POLICIES — storage (attachments)
-- ============================================================

create policy "attachments_public_select"
  on storage.objects for select
  using (bucket_id = 'attachments');

create policy "attachments_authenticated_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'attachments');
