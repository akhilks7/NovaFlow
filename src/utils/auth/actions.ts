"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import {
  checkPassword,
  humanizeAuthError,
  isEmail,
  readText,
} from "@/utils/validation";
import type { ActionState } from "@/utils/types";

/** Absolute origin for the links Supabase emails out. */
async function getOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}

/**
 * Only same-origin paths may be used as a post-login destination, otherwise the
 * `next` parameter becomes an open redirect.
 */
function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export async function login(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = readText(formData, "email");
  const password = readText(formData, "password");

  if (!email || !isEmail(email)) return { error: "Enter a valid email address." };
  if (!password) return { error: "Enter your password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: humanizeAuthError(error.message) };

  redirect(safeRedirectPath(readText(formData, "next")));
}

export async function signup(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const fullName = readText(formData, "full_name");
  const email = readText(formData, "email");
  const password = readText(formData, "password");

  if (!fullName) return { error: "Enter your name." };
  if (!email || !isEmail(email)) return { error: "Enter a valid email address." };

  const passwordProblem = checkPassword(password);
  if (passwordProblem) return { error: passwordProblem };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: password!,
    options: {
      emailRedirectTo: `${await getOrigin()}/auth/confirm`,
      data: { full_name: fullName },
    },
  });

  if (error) return { error: humanizeAuthError(error.message) };

  // With email confirmation switched on there is no session yet.
  if (!data.session) {
    return {
      notice: `Almost there — confirm your address using the link we sent to ${email}.`,
    };
  }

  redirect("/dashboard");
}

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = readText(formData, "email");

  if (!email || !isEmail(email)) return { error: "Enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await getOrigin()}/auth/confirm?next=/update-password`,
  });

  if (error) return { error: humanizeAuthError(error.message) };

  // Deliberately the same response whether or not the account exists, so this
  // form cannot be used to discover which emails are registered.
  return {
    notice: "If that address has an account, a reset link is on its way.",
  };
}

export async function updatePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = readText(formData, "password");
  const confirmation = readText(formData, "confirm_password");

  const passwordProblem = checkPassword(password);
  if (passwordProblem) return { error: passwordProblem };
  if (password !== confirmation) return { error: "The two passwords do not match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: password! });

  if (error) return { error: humanizeAuthError(error.message) };

  redirect("/dashboard");
}

/**
 * Password change from the settings page.
 *
 * Distinct from `updatePassword`: the caller already has a normal session
 * rather than a recovery one, so the current password is re-checked first and
 * the result is reported in place instead of redirecting.
 */
export async function changePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const currentPassword = readText(formData, "current_password");
  const password = readText(formData, "password");
  const confirmation = readText(formData, "confirm_password");

  if (!currentPassword) return { error: "Enter your current password." };

  const passwordProblem = checkPassword(password);
  if (passwordProblem) return { error: passwordProblem };
  if (password !== confirmation) return { error: "The two new passwords do not match." };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: "You are not signed in." };

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (reauthError) return { error: "Your current password is not correct." };

  const { error } = await supabase.auth.updateUser({ password: password! });

  if (error) return { error: humanizeAuthError(error.message) };

  return { notice: "Password updated." };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
