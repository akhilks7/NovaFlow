"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { matchNavItem, visibleNavItems } from "@/components/shell/navigation";

type NavListProps = {
  isAdmin: boolean;
  /** Supplied by the mobile drawer so choosing a destination closes it. */
  onNavigate?: () => void;
};

/** Vertical destination list. Shared by the sidebar and the mobile drawer. */
export function NavList({ isAdmin, onNavigate }: NavListProps) {
  const pathname = usePathname();
  const active = matchNavItem(pathname);

  return (
    <nav className="nav-list" aria-label="Main">
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
