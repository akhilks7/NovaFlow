"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/shell/MobileNav";
import { UserMenu } from "@/components/shell/UserMenu";
import { matchNavItem } from "@/components/shell/navigation";
import { ThemeButton } from "@/components/theme/ThemeButton";
import type { ThemePreference } from "@/components/theme/theme";
import type { Profile } from "@/utils/types";

type TopbarProps = {
  profile: Profile;
  isAdmin: boolean;
  themePreference: ThemePreference;
};

export function Topbar({ profile, isAdmin, themePreference }: TopbarProps) {
  const pathname = usePathname();
  const current = matchNavItem(pathname);

  return (
    <header className="topbar glass">
      <MobileNav isAdmin={isAdmin} />

      <div className="topbar__heading">
        <p className="topbar__title">{current?.label ?? "NovaFlow"}</p>
      </div>

      <div className="topbar__actions">
        <ThemeButton preference={themePreference} />
        <UserMenu profile={profile} />
      </div>
    </header>
  );
}
