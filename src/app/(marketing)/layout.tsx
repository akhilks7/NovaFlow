import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { ThemeButton } from "@/components/theme/ThemeButton";
import { isThemePreference, THEME_COOKIE } from "@/components/theme/theme";
import { LogoMark } from "@/components/ui/icons";
import { getSessionUserId } from "@/utils/auth/dal";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const preference = isThemePreference(stored) ? stored : "system";
  const signedIn = (await getSessionUserId()) !== null;

  return (
    <div className="site">
      <header className="site-header glass">
        <Link href="/" className="sidebar__brand">
          <span className="brand-mark">
            <LogoMark size={17} />
          </span>
          NovaFlow
        </Link>

        <div className="cluster" style={{ ["--gap" as string]: "0.4rem" }}>
          <ThemeButton preference={preference} />
          {signedIn ? (
            <Link href="/dashboard" className="btn btn--primary btn--sm">
              Open dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn--ghost btn--sm site-header__signin">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn--primary btn--sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="site-footer">
        <p className="muted">
          NovaFlow · Next.js 16 App Router and Supabase, with row level security.
        </p>
      </footer>
    </div>
  );
}
