import {
  DashboardIcon,
  FlowIcon,
  SettingsIcon,
  ShieldIcon,
  UserIcon,
  type IconProps,
} from "@/components/ui/icons";

type NavItem = {
  href: string;
  label: string;
  Icon: (props: IconProps) => React.ReactElement;
  adminOnly?: boolean;
};

/**
 * Single source of truth for the sidebar, the mobile drawer and the top bar
 * title. Imported directly by each Client Component — component references
 * cannot cross the server/client boundary as props.
 */
const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/workflows", label: "Workflows", Icon: FlowIcon },
  { href: "/admin/users", label: "Members", Icon: ShieldIcon, adminOnly: true },
  { href: "/profile", label: "Profile", Icon: UserIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function visibleNavItems(isAdmin: boolean): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);
}

/** Longest matching prefix, so `/admin/users/…` still highlights Members. */
export function matchNavItem(pathname: string): NavItem | undefined {
  return [...NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
