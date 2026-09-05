import Link from "next/link";
import { signout } from "@/utils/auth/actions";
import Avatar from "@/components/ui/Avatar";
import NavLink from "@/components/ui/NavLink";
import { GridIcon, BuildingIcon, ShieldIcon } from "@/components/ui/icons";

export default function AdminSidebar({ name, email }: { name: string; email: string }) {
  return (
    <aside className="admin-sidebar">
      <p className="admin-sidebar-label">Operations</p>
      <nav className="admin-nav">
        <NavLink href="/admin">
          <GridIcon width="16" height="16" />
          Overview
        </NavLink>
        <NavLink href="/admin/workspaces">
          <BuildingIcon width="16" height="16" />
          Workspaces
        </NavLink>
        <NavLink href="/admin/security">
          <ShieldIcon width="16" height="16" />
          Security
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
        <Link href="/dashboard" className="btn-ghost btn-sm">
          Switch to workspace
        </Link>
        <form action={signout}>
          <button type="submit" className="btn-secondary btn-sm">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}