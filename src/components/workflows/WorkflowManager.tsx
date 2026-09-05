"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EditIcon, FlowIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";
import { WorkflowDialog } from "@/components/workflows/WorkflowDialog";
import { deleteWorkflow } from "@/utils/workflows/actions";
import { formatDate } from "@/utils/format";
import type { WorkflowStatus, WorkflowWithOwner } from "@/utils/types";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

const STATUS_BADGE: Record<WorkflowStatus, string> = {
  active: "badge badge--positive",
  paused: "badge badge--caution",
  draft: "badge badge--info",
  archived: "badge",
};

const TRIGGER_LABEL: Record<string, string> = {
  schedule: "Schedule",
  webhook: "Webhook",
  event: "Event",
  manual: "Manual",
};

type DialogState =
  | { mode: "create" }
  | { mode: "edit"; workflow: WorkflowWithOwner }
  | { mode: "delete"; workflow: WorkflowWithOwner }
  | null;

type WorkflowManagerProps = {
  workflows: WorkflowWithOwner[];
  /** Admins see an owner column, because their list spans the whole workspace. */
  showOwner: boolean;
};

export function WorkflowManager({ workflows, showOwner }: WorkflowManagerProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [dialog, setDialog] = useState<DialogState>(null);

  const visible = useMemo(
    () => (filter === "all" ? workflows : workflows.filter((row) => row.status === filter)),
    [workflows, filter],
  );

  return (
    <div className="stack stack--lg">
      <header className="page-header">
        <div className="page-header__text">
          <p className="eyebrow">Automations</p>
          <h1 className="title-1">Workflows</h1>
          <p className="muted">
            {showOwner
              ? "Every workflow in the workspace."
              : "The workflows you own."}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setDialog({ mode: "create" })}
        >
          <PlusIcon size={17} className="btn__icon" />
          New workflow
        </button>
      </header>

      {workflows.length > 0 ? (
        <div className="segmented" role="radiogroup" aria-label="Filter by status">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={filter === option.value}
              className="segmented__option"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <section className="card card--flush glass">
        {visible.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">
              <FlowIcon size={24} />
            </span>
            <p className="title-3">
              {workflows.length === 0 ? "No workflows yet" : "Nothing matches this filter"}
            </p>
            <p className="muted">
              {workflows.length === 0
                ? "Create your first automation to see it here."
                : "Try a different status."}
            </p>
            {workflows.length === 0 ? (
              <button
                type="button"
                className="btn btn--primary"
                style={{ marginTop: "0.75rem" }}
                onClick={() => setDialog({ mode: "create" })}
              >
                <PlusIcon size={17} className="btn__icon" />
                New workflow
              </button>
            ) : null}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Workflow</th>
                  <th scope="col">Status</th>
                  <th scope="col">Trigger</th>
                  {showOwner ? <th scope="col">Owner</th> : null}
                  <th scope="col">Updated</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((workflow) => (
                  <tr key={workflow.id}>
                    <td>
                      <span className="table__cell-label">Workflow</span>
                      <span className="person__text">
                        <span className="person__name">{workflow.name}</span>
                        {workflow.description ? (
                          <span className="person__meta">{workflow.description}</span>
                        ) : null}
                      </span>
                    </td>
                    <td>
                      <span className="table__cell-label">Status</span>
                      <span className={STATUS_BADGE[workflow.status]}>
                        <span className="badge__dot" />
                        {workflow.status}
                      </span>
                    </td>
                    <td>
                      <span className="table__cell-label">Trigger</span>
                      <span className="secondary">
                        {TRIGGER_LABEL[workflow.trigger_kind] ?? workflow.trigger_kind}
                      </span>
                    </td>
                    {showOwner ? (
                      <td>
                        <span className="table__cell-label">Owner</span>
                        {workflow.owner ? (
                          <span className="person">
                            <Avatar
                              name={workflow.owner.full_name}
                              email={workflow.owner.email}
                              src={workflow.owner.avatar_url}
                              size={28}
                            />
                            <span className="person__text">
                              <span className="person__name">
                                {workflow.owner.full_name ?? workflow.owner.email}
                              </span>
                            </span>
                          </span>
                        ) : (
                          <span className="muted">Unknown</span>
                        )}
                      </td>
                    ) : null}
                    <td>
                      <span className="table__cell-label">Updated</span>
                      <time className="secondary" dateTime={workflow.updated_at}>
                        {formatDate(workflow.updated_at)}
                      </time>
                    </td>
                    <td>
                      <div className="table__actions">
                        <button
                          type="button"
                          className="btn btn--subtle btn--sm"
                          onClick={() => setDialog({ mode: "edit", workflow })}
                        >
                          <EditIcon size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost btn--icon"
                          onClick={() => setDialog({ mode: "delete", workflow })}
                          aria-label={`Delete ${workflow.name}`}
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {dialog?.mode === "create" ? (
        <WorkflowDialog onClose={() => setDialog(null)} />
      ) : null}

      {dialog?.mode === "edit" ? (
        <WorkflowDialog workflow={dialog.workflow} onClose={() => setDialog(null)} />
      ) : null}

      {dialog?.mode === "delete" ? (
        <ConfirmDialog
          title="Delete workflow"
          description={`“${dialog.workflow.name}” will be removed permanently. This cannot be undone.`}
          confirmLabel="Delete workflow"
          action={deleteWorkflow}
          fields={{ id: dialog.workflow.id }}
          onClose={() => setDialog(null)}
        />
      ) : null}
    </div>
  );
}
