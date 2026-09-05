-- NovaFlow · backfill profiles for accounts that predate the schema.
--
-- `handle_new_user` only fires for accounts created *after* the first
-- migration. Anyone who signed up before it ran is left with a row in
-- `auth.users` and none in `public.profiles`, which the app reports as
-- "Your account has no profile row yet".
--
-- Safe to run on a fresh project: with no pre-existing users it inserts
-- nothing, and `on conflict do nothing` makes a repeat run a no-op.

insert into public.profiles (id, email, full_name, avatar_url, job_title, role)
select
  u.id,
  u.email,
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), ''),
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'avatar_url', '')), ''),
  nullif(btrim(coalesce(u.raw_user_meta_data ->> 'job_title', '')), ''),
  case
    -- Mirror the bootstrap rule: if the workspace has no administrator yet,
    -- the oldest account becomes one. Both subqueries read the pre-statement
    -- snapshot, so exactly one row can match.
    when not exists (select 1 from public.profiles where role = 'admin')
     and u.created_at = (
       select min(created_at) from auth.users where email is not null
     )
    then 'admin'::public.app_role
    else 'member'::public.app_role
  end
from auth.users u
where u.email is not null
on conflict (id) do nothing;
