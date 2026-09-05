import type { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

function displayName(fullName: unknown, email?: string) {
  if (typeof fullName === "string" && fullName.trim()) return fullName;
  return email?.split("@")[0] ?? "Admin";
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = displayName(user?.user_metadata?.full_name, user?.email);
  const email = user?.email ?? "";

  return (
    <div className="admin-shell">
      <AdminTopbar />
      <div className="admin-body">
        <AdminSidebar name={name} email={email} />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}