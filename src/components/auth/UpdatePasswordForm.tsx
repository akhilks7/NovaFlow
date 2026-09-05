"use client";

import { useActionState } from "react";
import { updatePassword } from "@/utils/auth/actions";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { IDLE_ACTION_STATE } from "@/utils/types";
import { MIN_PASSWORD_LENGTH } from "@/utils/validation";

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePassword, IDLE_ACTION_STATE);

  return (
    <form action={formAction} className="stack stack--lg" noValidate>
      <FormNotice state={state} />

      <div className="field">
        <label className="field__label" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          autoComplete="new-password"
          placeholder="••••••••"
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
          placeholder="••••••••"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
      </div>

      <SubmitButton
        className="btn btn--primary btn--lg btn--block"
        pendingLabel="Updating…"
      >
        Update password
      </SubmitButton>
    </form>
  );
}
