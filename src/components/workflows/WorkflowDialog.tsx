"use client";

import { useActionState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createWorkflow, updateWorkflow } from "@/utils/workflows/actions";
import { IDLE_ACTION_STATE, type Workflow } from "@/utils/types";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Archived" },
];

const TRIGGER_OPTIONS = [
  { value: "schedule", label: "On a schedule" },
  { value: "webhook", label: "Incoming webhook" },
  { value: "event", label: "On an event" },
  { value: "manual", label: "Run manually" },
];

type WorkflowDialogProps = {
  /** Omitted when creating. */
  workflow?: Workflow;
  onClose: () => void;
};

export function WorkflowDialog({ workflow, onClose }: WorkflowDialogProps) {
  const editing = workflow !== undefined;
  const [state, formAction] = useActionState(
    editing ? updateWorkflow : createWorkflow,
    IDLE_ACTION_STATE,
  );

  useEffect(() => {
    if (state.notice) onClose();
  }, [state.notice, onClose]);

  return (
    <Dialog
      title={editing ? "Edit workflow" : "New workflow"}
      description={
        editing
          ? "Update how this automation is described and scheduled."
          : "Describe the automation. You can change any of this later."
      }
      onClose={onClose}
    >
      <form action={formAction} className="stack" noValidate>
        {editing ? <input type="hidden" name="id" value={workflow.id} /> : null}

        <FormNotice state={state} />

        <div className="field">
          <label className="field__label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="input"
            defaultValue={workflow?.name}
            placeholder="Nightly customer sync"
            maxLength={80}
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="textarea"
            defaultValue={workflow?.description ?? ""}
            placeholder="What does this workflow do, and who relies on it?"
            maxLength={400}
          />
        </div>

        <div className="grid" style={{ ["--min" as string]: "180px" }}>
          <div className="field">
            <label className="field__label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="select"
              defaultValue={workflow?.status ?? "draft"}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="trigger_kind">
              Trigger
            </label>
            <select
              id="trigger_kind"
              name="trigger_kind"
              className="select"
              defaultValue={workflow?.trigger_kind ?? "schedule"}
            >
              {TRIGGER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="dialog__footer">
          <button type="button" className="btn btn--glass" onClick={onClose}>
            Cancel
          </button>
          <SubmitButton pendingLabel="Saving…">
            {editing ? "Save changes" : "Create workflow"}
          </SubmitButton>
        </div>
      </form>
    </Dialog>
  );
}
