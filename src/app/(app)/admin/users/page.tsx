import type { Metadata } from "next";
import { MemberManager } from "@/components/admin/MemberManager";
import { listProfiles } from "@/utils/admin/queries";
import { requireProfile } from "@/utils/auth/dal";
import { hasServiceRoleKey } from "@/utils/supabase/admin";

export const metadata: Metadata = {
  title: "Members",
};

export default async function MembersPage() {
  // The admin gate lives in the layout; this page trusts it.
  const profile = await requireProfile();
  const members = await listProfiles();

  return (
    <div className="rise">
      <MemberManager
        members={members}
        currentUserId={profile.id}
        canManageAccounts={hasServiceRoleKey()}
      />
    </div>
  );
}
