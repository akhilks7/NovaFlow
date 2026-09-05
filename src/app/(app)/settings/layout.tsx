import type { ReactNode } from "react";
import NavLink from "@/components/ui/NavLink";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile, workspace, and notification preferences.</p>
        </div>
      </div>

      <nav className="settings-subnav">
        <NavLink href="/settings">Profile</NavLink>
        <NavLink href="/settings/notifications">Notifications</NavLink>
      </nav>

      {children}
    </div>
  );
}