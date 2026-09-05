import type { ReactNode } from "react";
import { AccessDenied } from "@/components/shell/AccessDenied";
import { isAdmin, requireProfile } from "@/utils/auth/dal";

/**
 * Role gate for everything under /admin. The database enforces the same rule
 * through RLS; this is what turns a policy error into a readable page.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireProfile();

  if (!isAdmin(profile)) return <AccessDenied />;

  return <>{children}</>;
}
