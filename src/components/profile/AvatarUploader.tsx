"use client";

import { useRef, useState, useTransition } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { CameraIcon, TrashIcon } from "@/components/ui/icons";
import { saveAvatarUrl } from "@/utils/profile/actions";
import { createClient } from "@/utils/supabase/client";

const BUCKET = "avatars";
const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

type AvatarUploaderProps = {
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

/**
 * Uploads straight from the browser to Supabase Storage, then hands the public
 * URL to a Server Action. Storage RLS scopes writes to `<user-id>/…`, so the
 * path below is the only one this account is allowed to use.
 */
export function AvatarUploader({ userId, email, name, avatarUrl }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();

  /** `…/object/public/avatars/<user-id>/<file>` → `<user-id>/<file>` */
  function storagePath(publicUrl: string | null): string | null {
    if (!publicUrl) return null;
    const marker = `/${BUCKET}/`;
    const index = publicUrl.indexOf(marker);
    return index === -1 ? null : publicUrl.slice(index + marker.length);
  }

  async function upload(file: File) {
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Choose a PNG, JPEG, WebP or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Images must be 2 MB or smaller.");
      return;
    }

    setBusy(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${userId}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const result = await saveAvatarUrl(publicUrl);

    if (result.error) {
      setError(result.error);
    } else {
      // Best effort tidy-up; a leftover file is harmless if this fails.
      const previous = storagePath(avatarUrl);
      if (previous) await supabase.storage.from(BUCKET).remove([previous]);
    }

    setBusy(false);
  }

  function remove() {
    setError(null);
    startTransition(async () => {
      const result = await saveAvatarUrl(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      const previous = storagePath(avatarUrl);
      if (previous) await createClient().storage.from(BUCKET).remove([previous]);
    });
  }

  const working = busy || pending;

  return (
    <div className="stack stack--sm">
      <div className="cluster">
        <Avatar name={name} email={email} src={avatarUrl} size={88} />

        <div className="stack stack--sm">
          <div className="cluster">
            <button
              type="button"
              className="btn btn--glass btn--sm"
              onClick={() => inputRef.current?.click()}
              disabled={working}
            >
              {working ? <span className="spinner" /> : <CameraIcon size={16} />}
              {avatarUrl ? "Replace photo" : "Upload photo"}
            </button>

            {avatarUrl ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={remove}
                disabled={working}
              >
                <TrashIcon size={16} />
                Remove
              </button>
            ) : null}
          </div>
          <p className="field__hint">PNG, JPEG, WebP or GIF. Up to 2 MB.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="visually-hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />

      {error ? (
        <p className="notice notice--error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
