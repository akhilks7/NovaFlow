import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { LogoMark } from "@/components/ui/icons";
import { SidebarNav } from "@/components/shell/SidebarNav";
import { isAdmin } from "@/utils/auth/dal";
import { titleCase } from "@/utils/format";
import type { Profile } from "@/utils/types";

/** Persistent navigation rail, shown from 1024px up. */
export function Sidebar({ profile }: { profile: Profile }) {
  const admin = isAdmin(profile);

  return (
    <div className="sidebar glass">
      <Link href="/dashboard" className="sidebar__brand">
        <span className="brand-mark">
          <LogoMark size={17} />
        </span>
        NovaFlow
      </Link>

      <SidebarNav isAdmin={admin} />

      <div className="sidebar__footer">
        <Link href="/profile" className="nav-item">
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
    </div>
  );
}
