-- NovaFlow · identity, profiles and the two-tier role model.
--
-- Roles
--   admin  — full read/write over every profile (create, read, update, delete)
--   member — reads and edits only their own profile
--
-- Bootstrap: the first account to sign up becomes `admin`. Every account after
-- that is created as `member` unless an admin creates it with a role in
-- `raw_app_meta_data` (service-role only, never writable by the user).

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.app_role as enum ('admin', 'member');
create type public.account_status as enum ('active', 'invited', 'suspended');

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text check (char_length(full_name) <= 80),
  avatar_url text check (char_length(avatar_url) <= 500),
  job_title text check (char_length(job_title) <= 80),
  bio text check (char_length(bio) <= 400),
  role public.app_role not null default 'member',
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Application profile for each auth user. `role` drives every authorization check.';

-- Indexes backing the admin directory (filter by role/status, newest first).
create index profiles_role_idx on public.profiles (role);
create index profiles_status_idx on public.profiles (status);
create index profiles_created_at_idx on public.profiles (created_at desc);

-- ---------------------------------------------------------------------------
-- Private helpers
--
-- Role lookups have to read `public.profiles`, but a policy *on* profiles that
-- queries profiles recurses. A `security definer` function breaks the cycle: it
-- runs with the owner's privileges, so RLS is not re-applied inside it.
--
-- Both helpers only ever read the *calling* user's own row, so exposing them to
-- `authenticated` leaks nothing beyond what the caller already knows.
-- ---------------------------------------------------------------------------

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $fn$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
      and p.status = 'active'
  );
$fn$;

create or replace function private.auth_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $fn$
  select p.role from public.profiles p where p.id = (select auth.uid());
$fn$;

revoke all on function private.is_admin() from public;
revoke all on function private.auth_role() from public;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.auth_role() to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

revoke all on public.profiles from anon;
grant select, insert, update, delete on public.profiles to authenticated;

-- Read: your own row, or every row when you are an admin.
create policy profiles_select on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select private.is_admin())
  );

-- Insert: normal sign-ups are inserted by the `handle_new_user` trigger, which
-- is security definer and bypasses this. Only admins may insert by hand.
create policy profiles_insert on public.profiles
  for insert
  to authenticated
  with check ((select private.is_admin()));

-- Update: your own row, or any row when you are an admin. Which *columns* may
-- change is enforced by the `guard_profile_write` trigger below, because RLS
-- cannot express column-level rules.
create policy profiles_update on public.profiles
  for update
  to authenticated
  using (
    id = (select auth.uid())
    or (select private.is_admin())
  )
  with check (
    id = (select auth.uid())
    or (select private.is_admin())
  );

-- Delete: admins only, and never yourself.
create policy profiles_delete on public.profiles
  for delete
  to authenticated
  using (
    (select private.is_admin())
    and id <> (select auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Trigger: provision a profile for every new auth user
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  claimed_role public.app_role;
  is_first_account boolean;
begin
  select not exists (select 1 from public.profiles) into is_first_account;

  -- Everyone starts as a member; the very first account bootstraps the
  -- workspace as its administrator.
  --
  -- The role is deliberately NOT read from `raw_app_meta_data` here: the Auth
  -- admin API writes that in a second statement *after* this insert, so it is
  -- always absent at this point. Admin-created admins get their role from
  -- `createMember` in src/utils/admin/actions.ts instead, which goes through
  -- RLS and the guard trigger below.
  claimed_role := case when is_first_account then 'admin' else 'member' end;

  -- `raw_user_meta_data` is user-editable, so it is only read for cosmetics.
  insert into public.profiles (id, email, full_name, avatar_url, job_title, role)
  values (
    new.id,
    new.email,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'avatar_url', '')), ''),
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'job_title', '')), ''),
    claimed_role
  )
  on conflict (id) do nothing;

  return new;
end;
$fn$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Trigger: column-level guard rails on update
--
-- Enforces three things RLS cannot:
--   1. identity columns (id, email, created_at) are immutable from the API
--   2. only admins may change `role` or `status`
--   3. the last active admin can never be demoted or suspended
-- ---------------------------------------------------------------------------

create or replace function public.guard_profile_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  -- Identity columns are owned by auth.users, never by the client.
  new.id := old.id;
  new.email := old.email;
  new.created_at := old.created_at;
  new.updated_at := now();

  if not (select private.is_admin()) then
    if new.role is distinct from old.role then
      raise exception 'Only administrators can change a role'
        using errcode = '42501';
    end if;

    if new.status is distinct from old.status then
      raise exception 'Only administrators can change an account status'
        using errcode = '42501';
    end if;
  end if;

  if old.role = 'admin' and old.status = 'active'
     and (new.role <> 'admin' or new.status <> 'active')
     and (
       select count(*) from public.profiles
       where role = 'admin' and status = 'active'
     ) <= 1
  then
    raise exception 'The last active administrator cannot be demoted or suspended'
      using errcode = '23514';
  end if;

  return new;
end;
$fn$;

create trigger profiles_guard_write
  before update on public.profiles
  for each row
  execute function public.guard_profile_write();

-- ---------------------------------------------------------------------------
-- Trigger: never delete the last admin
--
-- Also covers the cascade from `delete from auth.users`, which the service-role
-- key can perform outside of RLS.
-- ---------------------------------------------------------------------------

create or replace function public.guard_profile_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  if old.role = 'admin'
     and (select count(*) from public.profiles where role = 'admin') <= 1
  then
    raise exception 'The last administrator cannot be deleted'
      using errcode = '23514';
  end if;

  return old;
end;
$fn$;

create trigger profiles_guard_delete
  before delete on public.profiles
  for each row
  execute function public.guard_profile_delete();
