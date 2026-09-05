"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { matchNavItem, visibleNavItems } from "@/components/shell/navigation";

type SidebarNavProps = {
  isAdmin: boolean;
  /** Called after a navigation, so the mobile drawer can close itself. */
  onNavigate?: () => void;
};

export function SidebarNav({ isAdmin, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const active = matchNavItem(pathname);

  return (
    <nav className="sidebar__nav" aria-label="Main">
      {visibleNavItems(isAdmin).map(({ href, label, Icon, adminOnly }) => (
        <Link
          key={href}
          href={href}
          className="nav-item"
          aria-current={active?.href === href ? "page" : undefined}
          onClick={onNavigate}
        >
          <Icon size={19} className="nav-item__icon" />
          <span className="nav-item__label">{label}</span>
          {adminOnly ? <span className="badge badge--brand">Admin</span> : null}
        </Link>
      ))}
    </nav>
  );
}
