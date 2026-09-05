"use client";

import { useActionState, useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { FormNotice } from "@/components/ui/FormNotice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createMember } from "@/utils/admin/actions";
import { IDLE_ACTION_STATE } from "@/utils/types";
import { MIN_PASSWORD_LENGTH } from "@/utils/validation";

// Ambiguous glyphs (O/0, l/1) left out so the password survives being read aloud.
const PASSWORD_ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePassword(length = 16): string {
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (byte) => PASSWORD_ALPHABET[byte % PASSWORD_ALPHABET.length]).join("");
}

export function CreateMemberDialog({ onClose }: { onClose: () => void }) {
  const [state, formAction] = useActionState(createMember, IDLE_ACTION_STATE);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state.notice) onClose();
  }, [state.notice, onClose]);

  return (
    <Dialog
      title="Add member"
      description="The account is created ready to use — no email confirmation needed."
      onClose={onClose}
    >
      <form action={formAction} className="stack" noValidate>
        <FormNotice state={state} />

        <div className="field">
          <label className="field__label" htmlFor="new-full_name">
            Full name
          </label>
          <input
            id="new-full_name"
            name="full_name"
            type="text"
            className="input"
            placeholder="Grace Hopper"
            maxLength={80}
            required
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="new-email">
            Email
          </label>
          <input
            id="new-email"
            name="email"
            type="email"
            className="input"
            placeholder="grace@company.com"
            required
          />
        </div>

        <div className="field">
          <div className="cluster cluster--between">
            <label className="field__label" htmlFor="new-password">
              Temporary password
            </label>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setPassword(generatePassword())}
            >
              Generate
            </button>
          </div>
          <input
            id="new-password"
            name="password"
            // Deliberately readable: the admin has to pass this on to the person.
            type="text"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
          <p className="field__hint">
            Share this with them; they can change it under Settings.
          </p>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="new-role">
            Role
          </label>
          <select id="new-role" name="role" className="select" defaultValue="member">
            <option value="member">Member — their own workflows only</option>
            <option value="admin">Administrator — full access</option>
          </select>
        </div>

        <div className="dialog__footer">
          <button type="button" className="btn btn--glass" onClick={onClose}>
            Cancel
          </button>
          <SubmitButton pendingLabel="Creating…">Create account</SubmitButton>
        </div>
      </form>
    </Dialog>
  );
}
