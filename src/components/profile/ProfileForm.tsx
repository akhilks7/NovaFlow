"use client";

import { useActionState } from "react";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateOwnProfile } from "@/utils/profile/actions";
import { IDLE_ACTION_STATE, type Profile } from "@/utils/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateOwnProfile, IDLE_ACTION_STATE);

  return (
    <form action={formAction} className="stack" noValidate>
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
          defaultValue={profile.full_name ?? ""}
          maxLength={80}
          autoComplete="name"
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="job_title">
          Job title
        </label>
        <input
          id="job_title"
          name="job_title"
          type="text"
          className="input"
          defaultValue={profile.job_title ?? ""}
          placeholder="Automation engineer"
          maxLength={80}
          autoComplete="organization-title"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="bio">
          About
        </label>
        <textarea
          id="bio"
          name="bio"
          className="textarea"
          defaultValue={profile.bio ?? ""}
          placeholder="A sentence or two about what you work on."
          maxLength={400}
        />
        <p className="field__hint">Up to 400 characters.</p>
      </div>

      <div className="cluster">
        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}
