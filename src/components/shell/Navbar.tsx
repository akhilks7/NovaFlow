"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/shell/MobileNav";
import { UserMenu } from "@/components/shell/UserMenu";
import { matchNavItem, visibleNavItems } from "@/components/shell/navigation";
import { ThemeButton } from "@/components/theme/ThemeButton";
import type { ThemePreference } from "@/components/theme/theme";
import type { Profile } from "@/utils/types";

/** The pill only stays readable up to five destinations. */
const MAX_LINKS = 5;

type NavbarProps = {
  profile: Profile;
  isAdmin: boolean;
  themePreference: ThemePreference;
};

/**
 * Floating pill bar over the content column: the same destinations as the
 * sidebar, centred, with account controls on the right.
 *
 * Laid out as `1fr auto 1fr` so the centre group sits on the true midpoint
 * regardless of how wide the flanking groups are.
 */
export function Navbar({ profile, isAdmin, themePreference }: NavbarProps) {
  const pathname = usePathname();
  const current = matchNavItem(pathname);
  const links = visibleNavItems(isAdmin).slice(0, MAX_LINKS);

  return (
    <div className="navbar-wrap">
      <div className="navbar">
        <div className="navbar__lead">
          <MobileNav isAdmin={isAdmin} />
          {/* Context for the narrow layouts, where the centre links are hidden. */}
          <p className="navbar__title">{current?.label ?? "NovaFlow"}</p>
        </div>

        <div className="navbar__links">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="navbar__link"
              aria-current={current?.href === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="navbar__actions">
          <ThemeButton preference={themePreference} />
          <UserMenu profile={profile} />
        </div>
      </div>
    </div>
  );
}
