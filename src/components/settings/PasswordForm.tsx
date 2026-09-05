"use client";

import { useActionState } from "react";
import { changePassword } from "@/utils/auth/actions";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { IDLE_ACTION_STATE } from "@/utils/types";
import { MIN_PASSWORD_LENGTH } from "@/utils/validation";

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, IDLE_ACTION_STATE);

  return (
    <form action={formAction} className="stack" noValidate>
      <FormNotice state={state} />

      <div className="field">
        <label className="field__label" htmlFor="current_password">
          Current password
        </label>
        <input
          id="current_password"
          name="current_password"
          type="password"
          className="input"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="new_password">
          New password
        </label>
        <input
          id="new_password"
          name="password"
          type="password"
          className="input"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
        <p className="field__hint">At least {MIN_PASSWORD_LENGTH} characters.</p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="confirm_password">
          Confirm new password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          className="input"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
      </div>

      <div className="cluster">
        <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
      </div>
    </form>
  );
}
