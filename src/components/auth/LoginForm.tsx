"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/utils/auth/actions";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { IDLE_ACTION_STATE, type ActionState } from "@/utils/types";

type LoginFormProps = {
  /** Where the proxy wanted them to go before it asked them to sign in. */
  next?: string;
  /** Surfaced by /auth/confirm when an email link has expired. */
  initialError?: string;
};

export function LoginForm({ next, initialError }: LoginFormProps) {
  const initial: ActionState = initialError ? { error: initialError } : IDLE_ACTION_STATE;
  const [state, formAction] = useActionState(login, initial);

  return (
    <form action={formAction} className="stack stack--lg" noValidate>
      <FormNotice state={state} />

      {next ? <input type="hidden" name="next" value={next} /> : null}

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

      <div className="field">
        <div className="cluster cluster--between">
          <label className="field__label" htmlFor="password">
            Password
          </label>
          <Link href="/forgot-password" style={{ fontSize: "0.8125rem" }}>
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      <SubmitButton className="btn btn--primary btn--lg btn--block" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
