import { Logo } from "@/components/ui/icons";

export default function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <span className="admin-platform-name">
        <Logo width="20" height="20" />
        NovaFlow Platform
        <span className="tag">Super Admin</span>
      </span>
      <div className="spacer" />
      <span className="env-pill">
        <span className="dot" />
        all systems operational
      </span>
    </header>
  );
}