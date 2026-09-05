import { redirect } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Landing point for every emailed auth link (signup confirmation, magic link,
 * password recovery). Exchanges the one-time token for a session, then hands
 * the visitor on to `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");
  const destination = next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (!tokenHash || !type) {
    redirect("/login?error=This%20link%20is%20not%20valid.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    redirect("/login?error=This%20link%20has%20expired%20or%20was%20already%20used.");
  }

  redirect(destination);
}
