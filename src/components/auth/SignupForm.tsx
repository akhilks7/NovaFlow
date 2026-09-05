"use client";

import { useActionState } from "react";
import { signup } from "@/utils/auth/actions";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { IDLE_ACTION_STATE } from "@/utils/types";
import { MIN_PASSWORD_LENGTH } from "@/utils/validation";

export function SignupForm() {
  const [state, formAction] = useActionState(signup, IDLE_ACTION_STATE);

  return (
    <form action={formAction} className="stack stack--lg" noValidate>
      <FormNotice state={state} />

      <div className="field">
        <label className="field__label" htmlFor="full_name">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          className="input"
          autoComplete="name"
          placeholder="Ada Lovelace"
          maxLength={80}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="email">
          Work email
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

      <div className="field">
        <label className="field__label" htmlFor="password">
          Password
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

      <SubmitButton
        className="btn btn--primary btn--lg btn--block"
        pendingLabel="Creating account…"
      >
        Create account
      </SubmitButton>
    </form>
  );
}
