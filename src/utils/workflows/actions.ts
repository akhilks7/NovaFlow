"use server";

import { refresh } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { requireProfile } from "@/utils/auth/dal";
import { readOneOf, readText } from "@/utils/validation";
import type { ActionState, TriggerKind, WorkflowStatus } from "@/utils/types";

const STATUSES: readonly WorkflowStatus[] = ["draft", "active", "paused", "archived"];
const TRIGGERS: readonly TriggerKind[] = ["schedule", "webhook", "manual", "event"];

type WorkflowInput = {
  name: string;
  description: string | null;
  status: WorkflowStatus;
  trigger_kind: TriggerKind;
};

function parseWorkflow(formData: FormData): WorkflowInput | string {
  const name = readText(formData, "name");
  if (!name) return "Give the workflow a name.";
  if (name.length > 80) return "Keep the name under 80 characters.";

  const description = readText(formData, "description");
  if (description && description.length > 400) {
    return "Keep the description under 400 characters.";
  }

  return {
    name,
    description,
    status: readOneOf(formData, "status", STATUSES) ?? "draft",
    trigger_kind: readOneOf(formData, "trigger_kind", TRIGGERS) ?? "schedule",
  };
}

export async function createWorkflow(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireProfile();
  const parsed = parseWorkflow(formData);
  if (typeof parsed === "string") return { error: parsed };

  const supabase = await createClient();
  const { error } = await supabase
    .from("workflows")
    .insert({ ...parsed, owner_id: profile.id });

  if (error) return { error: error.message };

  refresh();
  return { notice: `“${parsed.name}” created.` };
}

export async function updateWorkflow(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireProfile();

  const id = readText(formData, "id");
  if (!id) return { error: "Missing workflow reference." };

  const parsed = parseWorkflow(formData);
  if (typeof parsed === "string") return { error: parsed };

  // RLS restricts this to workflows the caller owns, or any workflow for admins.
  const supabase = await createClient();
  const { error, count } = await supabase
    .from("workflows")
    .update(parsed, { count: "exact" })
    .eq("id", id);

  if (error) return { error: error.message };
  if (count === 0) return { error: "That workflow is no longer available to you." };

  refresh();
  return { notice: `“${parsed.name}” saved.` };
}

export async function deleteWorkflow(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireProfile();

  const id = readText(formData, "id");
  if (!id) return { error: "Missing workflow reference." };

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("workflows")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) return { error: error.message };
  if (count === 0) return { error: "That workflow is no longer available to you." };

  refresh();
  return { notice: "Workflow deleted." };
}
