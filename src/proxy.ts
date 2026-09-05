import type { NextRequest } from "next/server";
import { loadEnvConfig } from "@next/env";
import { updateSession } from "@/utils/supabase/middleware";

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/settings/:path*", "/admin/:path*"],
};