"use client";

import { useActionState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { IDLE_ACTION_STATE, type ActionState } from "@/utils/types";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  /** Server Action run when the person confirms. */
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  /** Hidden inputs the action needs, e.g. the row id. */
  fields: Record<string, string>;
  onClose: () => void;
};

/** Shared destructive-confirmation modal for delete flows. */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  action,
  fields,
  onClose,
}: ConfirmDialogProps) {
  const [state, formAction] = useActionState(action, IDLE_ACTION_STATE);

  useEffect(() => {
    if (state.notice) onClose();
  }, [state.notice, onClose]);

  return (
    <Dialog title={title} description={description} onClose={onClose}>
      <form action={formAction} className="stack">
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

        <FormNotice state={state} />

        <div className="dialog__footer">
          <button type="button" className="btn btn--glass" onClick={onClose}>
            Cancel
          </button>
          <SubmitButton className="btn btn--danger" pendingLabel="Working…">
            {confirmLabel}
          </SubmitButton>
        </div>
      </form>
    </Dialog>
  );
}
