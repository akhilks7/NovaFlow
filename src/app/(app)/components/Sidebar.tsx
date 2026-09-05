import Link from "next/link";
import { signout } from "@/utils/auth/actions";
import Avatar from "@/components/ui/Avatar";
import NavLink from "@/components/ui/NavLink";
import { Logo, GridIcon, GearIcon } from "@/components/ui/icons";

export default function Sidebar({ name, email }: { name: string; email: string }) {
  return (
    <aside className="app-sidebar">
      <Link href="/dashboard" className="brand">
        <Logo width="24" height="24" />
        NovaFlow
      </Link>

      <nav className="app-nav">
        <NavLink href="/dashboard">
          <GridIcon width="16" height="16" />
          Overview
        </NavLink>
        <NavLink href="/settings">
          <GearIcon width="16" height="16" />
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar name={name} />
          <div className="meta">
            <span className="name">{name}</span>
            <span className="email">{email}</span>
          </div>
        </div>
        <form action={signout}>
          <button type="submit" className="btn-secondary btn-sm">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}