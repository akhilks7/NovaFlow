"use client";

import { useActionState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateMember } from "@/utils/admin/actions";
import { IDLE_ACTION_STATE, type Profile } from "@/utils/types";

type EditMemberDialogProps = {
  member: Profile;
  /** True when the admin is editing their own row. */
  isSelf: boolean;
  onClose: () => void;
};

export function EditMemberDialog({ member, isSelf, onClose }: EditMemberDialogProps) {
  const [state, formAction] = useActionState(updateMember, IDLE_ACTION_STATE);

  useEffect(() => {
    if (state.notice) onClose();
  }, [state.notice, onClose]);

  return (
    <Dialog title="Edit member" description={member.email} onClose={onClose}>
      <form action={formAction} className="stack" noValidate>
        <input type="hidden" name="id" value={member.id} />

        <FormNotice state={state} />

        <div className="field">
          <label className="field__label" htmlFor="edit-full_name">
            Full name
          </label>
          <input
            id="edit-full_name"
            name="full_name"
            type="text"
            className="input"
            defaultValue={member.full_name ?? ""}
            maxLength={80}
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="edit-job_title">
            Job title
          </label>
          <input
            id="edit-job_title"
            name="job_title"
            type="text"
            className="input"
            defaultValue={member.job_title ?? ""}
            maxLength={80}
          />
        </div>

        <div className="grid" style={{ ["--min" as string]: "180px" }}>
          <div className="field">
            <label className="field__label" htmlFor="edit-role">
              Role
            </label>
            <select
              id="edit-role"
              name="role"
              className="select"
              defaultValue={member.role}
              disabled={isSelf}
            >
              <option value="member">Member</option>
              <option value="admin">Administrator</option>
            </select>
            {isSelf ? (
              <p className="field__hint">You cannot change your own role.</p>
            ) : null}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="edit-status">
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              className="select"
              defaultValue={member.status}
            >
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* A disabled select submits nothing, so keep the value in the payload. */}
        {isSelf ? <input type="hidden" name="role" value={member.role} /> : null}

        <div className="dialog__footer">
          <button type="button" className="btn btn--glass" onClick={onClose}>
            Cancel
          </button>
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
        </div>
      </form>
    </Dialog>
  );
}
