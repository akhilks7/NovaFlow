import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Navbar } from "@/components/shell/Navbar";
import { Sidebar } from "@/components/shell/Sidebar";
import { isThemePreference, THEME_COOKIE } from "@/components/theme/theme";
import { isAdmin, requireProfile } from "@/utils/auth/dal";

/**
 * Authenticated shell. `requireProfile` re-verifies the user against Supabase
 * on every render — the proxy redirect is only an optimistic first pass.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await requireProfile();
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const themePreference = isThemePreference(stored) ? stored : "system";
  const admin = isAdmin(profile);

  return (
    <div className="shell">
      <div className="shell__sidebar">
        <Sidebar profile={profile} isAdmin={admin} />
      </div>

      <div className="shell__main">
        <Navbar profile={profile} isAdmin={admin} themePreference={themePreference} />
        <main id="main" className="shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}
