import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { LogoMark } from "@/components/ui/icons";
import { NavList } from "@/components/shell/NavList";
import { titleCase } from "@/utils/format";
import type { Profile } from "@/utils/types";

/** Persistent navigation rail, shown from 1024px up. */
export function Sidebar({ profile, isAdmin }: { profile: Profile; isAdmin: boolean }) {
  return (
    <div className="sidebar glass">
      <Link href="/dashboard" className="brand">
        <span className="brand-mark">
          <LogoMark size={17} />
        </span>
        NovaFlow
      </Link>

      <NavList isAdmin={isAdmin} />

      <Link href="/profile" className="sidebar__account">
        <Avatar
          name={profile.full_name}
          email={profile.email}
          src={profile.avatar_url}
          size={32}
        />
        <span className="person__text">
          <span className="person__name">{profile.full_name ?? profile.email}</span>
          <span className="person__meta">{titleCase(profile.role)}</span>
        </span>
      </Link>
    </div>
  );
}
