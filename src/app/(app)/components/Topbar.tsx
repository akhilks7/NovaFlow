import Avatar from "@/components/ui/Avatar";
import { BellIcon } from "@/components/ui/icons";

export default function Topbar({ name }: { name: string }) {
  return (
    <header className="app-topbar">
      <div className="topbar-search">
        <input type="search" placeholder="Search workflows, executions…" aria-label="Search" />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <BellIcon width="16" height="16" />
        </button>
        <Avatar name={name} size="sm" />
        <span className="topbar-name">{name}</span>
      </div>
    </header>
  );
}