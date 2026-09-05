import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Signed-out visitors are bounced away from these prefixes. */
const PROTECTED_PREFIXES = ["/dashboard", "/workflows", "/profile", "/settings", "/admin"];

/** Signed-in visitors have no reason to see these. */
const SIGNED_OUT_ONLY = ["/login", "/signup", "/forgot-password"];

/**
 * Refreshes the Supabase auth cookies on every request and performs an
 * *optimistic* redirect based on them.
 *
 * This is intentionally cookie-only: the proxy runs on every route including
 * prefetches, so it does no database work. Real authorization lives in the DAL
 * (`src/utils/auth/dal.ts`), which re-verifies the user on the server.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Remember where they were headed so login can send them back.
    url.search = path === "/dashboard" ? "" : `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(url);
  }

  if (user && SIGNED_OUT_ONLY.includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
