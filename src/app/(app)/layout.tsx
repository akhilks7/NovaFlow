import type { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function displayName(fullName: unknown, email?: string) {
  if (typeof fullName === "string" && fullName.trim()) return fullName;
  return email?.split("@")[0] ?? "User";
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = displayName(user?.user_metadata?.full_name, user?.email);
  const email = user?.email ?? "";

  return (
    <div className="app-shell">
      <Sidebar name={name} email={email} />
      <div className="app-main">
        <Topbar name={name} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}