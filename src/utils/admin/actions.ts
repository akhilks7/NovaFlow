"use server";

import { refresh } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isAdmin, requireProfile } from "@/utils/auth/dal";
import {
  checkPassword,
  humanizeAuthError,
  isEmail,
  readOneOf,
  readText,
} from "@/utils/validation";
import type { AccountStatus, ActionState, AppRole, Profile } from "@/utils/types";

const ROLES: readonly AppRole[] = ["admin", "member"];
const STATUSES: readonly AccountStatus[] = ["active", "invited", "suspended"];

/**
 * Server-side authorization gate for every admin mutation.
 *
 * RLS already enforces this in the database; repeating it here means a forged
 * POST fails fast with a readable message instead of an opaque policy error.
 */
async function requireAdminProfile(): Promise<Profile | string> {
  const profile = await requireProfile();
  if (!isAdmin(profile)) return "You do not have permission to manage members.";
  return profile;
}

export async function createMember(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAdminProfile();
  if (typeof actor === "string") return { error: actor };

  const fullName = readText(formData, "full_name");
  const email = readText(formData, "email");
  const password = readText(formData, "password");
  const role = readOneOf(formData, "role", ROLES) ?? "member";

  if (!fullName) return { error: "Enter a name." };
  if (!email || !isEmail(email)) return { error: "Enter a valid email address." };

  const passwordProblem = checkPassword(password);
  if (passwordProblem) return { error: passwordProblem };

  // Creating an `auth.users` row is the one operation the anon key cannot do.
  let admin;
  try {
    admin = createAdminClient();
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : "Admin API unavailable." };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: password!,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) return { error: humanizeAuthError(error.message) };

  // `handle_new_user` has already provisioned the profile as a member. Promote
  // it through the normal authenticated client so RLS and the guard trigger
  // still apply — the service-role client is only used to mint the auth user.
  if (role === "admin" && data.user) {
    const supabase = await createClient();
    const { error: roleError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", data.user.id);

    if (roleError) {
      return {
        error: `${fullName} was created as a member, but could not be promoted: ${roleError.message}`,
      };
    }
  }

  refresh();
  return { notice: `${fullName} can now sign in with ${email}.` };
}

export async function updateMember(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAdminProfile();
  if (typeof actor === "string") return { error: actor };

  const id = readText(formData, "id");
  if (!id) return { error: "Missing member reference." };

  const fullName = readText(formData, "full_name");
  if (!fullName) return { error: "Enter a name." };

  const role = readOneOf(formData, "role", ROLES);
  const status = readOneOf(formData, "status", STATUSES);
  if (!role || !status) return { error: "Choose a role and a status." };

  if (id === actor.id && role !== "admin") {
    return { error: "You cannot remove your own admin access." };
  }

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("profiles")
    .update({ full_name: fullName, job_title: readText(formData, "job_title"), role, status }, { count: "exact" })
    .eq("id", id);

  // The `profiles_guard_write` trigger raises when the last active admin would
  // lose access; surface that text rather than a generic failure.
  if (error) return { error: error.message };
  if (count === 0) return { error: "That member no longer exists." };

  refresh();
  return { notice: `${fullName} updated.` };
}

export async function deleteMember(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAdminProfile();
  if (typeof actor === "string") return { error: actor };

  const id = readText(formData, "id");
  if (!id) return { error: "Missing member reference." };
  if (id === actor.id) return { error: "You cannot delete your own account." };

  const supabase = await createClient();
  const { data: target, error: lookupError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", id)
    .maybeSingle();

  if (lookupError) return { error: lookupError.message };
  if (!target) return { error: "That member no longer exists." };

  if (target.role === "admin") {
    return { error: "Change this person to a member before deleting their account." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : "Admin API unavailable." };
  }

  // Removing the auth user cascades to `profiles` and everything they own.
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) return { error: humanizeAuthError(error.message) };

  refresh();
  return { notice: `${target.full_name ?? target.email} removed.` };
}
