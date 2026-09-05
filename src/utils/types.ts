/** Shared row and form-state shapes, mirroring the SQL migrations. */

export type AppRole = "admin" | "member";
export type AccountStatus = "active" | "invited" | "suspended";
export type WorkflowStatus = "draft" | "active" | "paused" | "archived";
export type TriggerKind = "schedule" | "webhook" | "manual" | "event";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  bio: string | null;
  role: AppRole;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export type Workflow = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  status: WorkflowStatus;
  trigger_kind: TriggerKind;
  created_at: string;
  updated_at: string;
};

/** A workflow joined with the profile that owns it (admin views only). */
export type WorkflowWithOwner = Workflow & {
  owner: Pick<Profile, "id" | "full_name" | "email" | "avatar_url"> | null;
};

export type ActivityEntry = {
  id: number;
  actor_id: string | null;
  action:
    | "created"
    | "updated"
    | "deleted"
    | "joined"
    | "role_changed"
    | "status_changed";
  entity: "workflow" | "member";
  entity_label: string | null;
  created_at: string;
};

/**
 * Return shape for every Server Action driven by `useActionState`.
 * Expected failures come back as values; only bugs throw.
 */
export type ActionState = {
  error?: string;
  notice?: string;
};

export const IDLE_ACTION_STATE: ActionState = {};
