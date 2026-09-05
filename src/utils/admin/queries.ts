import { createClient } from "@/utils/supabase/server";
import type { Profile } from "@/utils/types";

/**
 * Every profile in the workspace. RLS only returns more than the caller's own
 * row when they are an admin, so this is safe to call from the admin pages.
 */
export async function listProfiles(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load the directory: ${error.message}`);

  return (data ?? []) as Profile[];
}
