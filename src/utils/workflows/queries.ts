import { createClient } from "@/utils/supabase/server";
import type { WorkflowWithOwner } from "@/utils/types";

/**
 * Workflows the caller is allowed to see. RLS decides the scope: members get
 * their own rows, admins get everyone's — the query is identical either way.
 */
export async function listWorkflows(): Promise<WorkflowWithOwner[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workflows")
    // `workflows.owner_id` is the only foreign key to profiles, so the embed is
    // unambiguous without naming the constraint.
    .select("*, owner:profiles(id, full_name, email, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load workflows: ${error.message}`);

  return (data ?? []) as WorkflowWithOwner[];
}
