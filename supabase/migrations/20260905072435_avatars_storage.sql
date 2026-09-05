-- NovaFlow · avatar storage.
--
-- Objects are keyed `<user-id>/<filename>`, so the first path segment is the
-- ownership check. The bucket is public-read (avatars appear in the sidebar and
-- the admin directory) but only the owner may write to their own folder.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- `storage.objects` is shared with every other bucket in the project and may
-- already carry policies, so each one is dropped before it is created. This
-- keeps the file safe to re-run after a partial failure.
drop policy if exists avatars_read on storage.objects;
drop policy if exists avatars_insert on storage.objects;
drop policy if exists avatars_update on storage.objects;
drop policy if exists avatars_delete on storage.objects;

-- Public read: the bucket is served from a CDN URL embedded in the UI.
create policy avatars_read on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

-- Upload, replace and remove are limited to the caller's own folder.
-- Replacing a file (upsert) needs INSERT + SELECT + UPDATE, so all three exist.
create policy avatars_insert on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy avatars_update on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy avatars_delete on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
