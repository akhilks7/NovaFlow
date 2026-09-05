import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile } from "@/utils/types";

/**
 * The single place the app resolves "who is asking?".
 *
 * `getUser()` revalidates the token with Supabase on every call, so this is
 * safe to trust for authorization — unlike the session cookie the proxy reads.
 * `cache` collapses the repeated calls a single render makes (layout, topbar,
 * page) into one round trip.
 */
const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load your profile: ${error.message}`);
  }

  if (!data) {
    // The signup trigger from the first migration provisions this row. A signed
    // in user without one means the migrations have not been applied yet.
    throw new Error(
      "Your account has no profile row yet. Run the migrations in supabase/migrations, then sign in again.",
    );
  }

  return data as Profile;
});

/**
 * Just "is anyone signed in?", without loading a profile.
 *
 * Used by public pages, which should not fail when a session exists but the
 * profile row does not.
 */
export const getSessionUserId = cache(async (): Promise<string | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
});

/** Guards every page under the authenticated shell. */
export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");

  return profile;
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === "admin" && profile.status === "active";
}
