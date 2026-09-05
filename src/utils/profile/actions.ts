"use server";

import { refresh } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { requireProfile } from "@/utils/auth/dal";
import { readText } from "@/utils/validation";
import type { ActionState } from "@/utils/types";

/**
 * Updates the caller's own profile.
 *
 * Role, status, email and id are all rejected at the database level by the
 * `profiles_guard_write` trigger, so a forged POST here cannot escalate.
 */
export async function updateOwnProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireProfile();

  const fullName = readText(formData, "full_name");
  if (!fullName) return { error: "Your name cannot be empty." };
  if (fullName.length > 80) return { error: "Keep your name under 80 characters." };

  const bio = readText(formData, "bio");
  if (bio && bio.length > 400) return { error: "Keep your bio under 400 characters." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      job_title: readText(formData, "job_title"),
      bio,
    })
    .eq("id", profile.id);

  if (error) return { error: error.message };

  refresh();
  return { notice: "Profile saved." };
}

/** Stores the public URL produced by the avatar uploader. */
export async function saveAvatarUrl(avatarUrl: string | null): Promise<ActionState> {
  const profile = await requireProfile();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", profile.id);

  if (error) return { error: error.message };

  refresh();
  return { notice: avatarUrl ? "Photo updated." : "Photo removed." };
}
