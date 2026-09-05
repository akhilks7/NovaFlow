"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/utils/auth/actions";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { IDLE_ACTION_STATE } from "@/utils/types";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, IDLE_ACTION_STATE);

  return (
    <form action={formAction} className="stack stack--lg" noValidate>
      <FormNotice state={state} />

      <div className="field">
        <label className="field__label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />
      </div>

      <SubmitButton
        className="btn btn--primary btn--lg btn--block"
        pendingLabel="Sending link…"
      >
        Send reset link
      </SubmitButton>
    </form>
  );
}
