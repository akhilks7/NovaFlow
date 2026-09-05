-- NovaFlow · workflows (the product surface both roles work in) and the
-- activity log that feeds the dashboard.
--
-- Visibility mirrors the role model from the previous migration:
--   member — sees and edits only the workflows they own
--   admin  — sees and edits every workflow, and every activity entry

-- ---------------------------------------------------------------------------
-- Workflows
-- ---------------------------------------------------------------------------

create type public.workflow_status as enum ('draft', 'active', 'paused', 'archived');

create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  description text check (char_length(description) <= 400),
  status public.workflow_status not null default 'draft',
  trigger_kind text not null default 'schedule'
    check (trigger_kind in ('schedule', 'webhook', 'manual', 'event')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workflows is
  'Automations owned by a profile. Members own theirs; admins oversee all.';

-- Foreign keys are not indexed automatically; owner_id drives every list query
-- and the cascade from profiles.
create index workflows_owner_id_idx on public.workflows (owner_id);
create index workflows_status_idx on public.workflows (status);
create index workflows_created_at_idx on public.workflows (created_at desc);

alter table public.workflows enable row level security;

revoke all on public.workflows from anon;
grant select, insert, update, delete on public.workflows to authenticated;

create policy workflows_select on public.workflows
  for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    or (select private.is_admin())
  );

-- You may only create workflows under your own name.
create policy workflows_insert on public.workflows
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy workflows_update on public.workflows
  for update
  to authenticated
  using (
    owner_id = (select auth.uid())
    or (select private.is_admin())
  )
  with check (
    owner_id = (select auth.uid())
    or (select private.is_admin())
  );

create policy workflows_delete on public.workflows
  for delete
  to authenticated
  using (
    owner_id = (select auth.uid())
    or (select private.is_admin())
  );

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $fn$
begin
  new.updated_at := now();
  return new;
end;
$fn$;

create trigger workflows_touch_updated_at
  before update on public.workflows
  for each row
  execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Activity log
-- ---------------------------------------------------------------------------

create table public.activity_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null
    check (action in ('created', 'updated', 'deleted', 'joined', 'role_changed', 'status_changed')),
  entity text not null check (entity in ('workflow', 'member')),
  entity_label text check (char_length(entity_label) <= 120),
  created_at timestamptz not null default now()
);

comment on table public.activity_log is
  'Append-only audit feed. Written by triggers, never by the client.';

create index activity_log_actor_id_idx on public.activity_log (actor_id);
create index activity_log_created_at_idx on public.activity_log (created_at desc);

alter table public.activity_log enable row level security;

revoke all on public.activity_log from anon;
-- Read-only from the API: rows are produced by the triggers below.
grant select on public.activity_log to authenticated;

create policy activity_log_select on public.activity_log
  for select
  to authenticated
  using (
    actor_id = (select auth.uid())
    or (select private.is_admin())
  );

create or replace function public.log_activity(
  p_action text,
  p_entity text,
  p_label text
)
returns void
language sql
security definer
set search_path = ''
as $fn$
  insert into public.activity_log (actor_id, action, entity, entity_label)
  values ((select auth.uid()), p_action, p_entity, p_label);
$fn$;

-- Only the triggers below call this; nothing should reach it over the API.
revoke all on function public.log_activity(text, text, text) from public;

-- ---------------------------------------------------------------------------
-- Triggers that populate the feed
-- ---------------------------------------------------------------------------

create or replace function public.record_workflow_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  if tg_op = 'INSERT' then
    perform public.log_activity('created', 'workflow', new.name);
    return new;
  elsif tg_op = 'UPDATE' then
    perform public.log_activity('updated', 'workflow', new.name);
    return new;
  else
    perform public.log_activity('deleted', 'workflow', old.name);
    return old;
  end if;
end;
$fn$;

create trigger workflows_record_activity
  after insert or update or delete on public.workflows
  for each row
  execute function public.record_workflow_activity();

create or replace function public.record_member_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  label text := coalesce(nullif(btrim(coalesce(new.full_name, '')), ''), new.email);
begin
  if tg_op = 'INSERT' then
    -- `auth.uid()` is null during sign-up, so credit the new member themselves.
    insert into public.activity_log (actor_id, action, entity, entity_label)
    values (new.id, 'joined', 'member', label);
    return new;
  end if;

  if new.role is distinct from old.role then
    perform public.log_activity('role_changed', 'member', label || ' → ' || new.role);
  end if;

  if new.status is distinct from old.status then
    perform public.log_activity('status_changed', 'member', label || ' → ' || new.status);
  end if;

  return new;
end;
$fn$;

create trigger profiles_record_activity
  after insert or update on public.profiles
  for each row
  execute function public.record_member_activity();
