import type { Metadata } from "next";
import { WorkflowManager } from "@/components/workflows/WorkflowManager";
import { isAdmin, requireProfile } from "@/utils/auth/dal";
import { listWorkflows } from "@/utils/workflows/queries";

export const metadata: Metadata = {
  title: "Workflows",
};

export default async function WorkflowsPage() {
  const profile = await requireProfile();
  const workflows = await listWorkflows();

  return (
    <div className="rise">
      <WorkflowManager workflows={workflows} showOwner={isAdmin(profile)} />
    </div>
  );
}
