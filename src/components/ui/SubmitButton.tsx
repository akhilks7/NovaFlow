"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  icon?: ReactNode;
};

/**
 * Submit control that reads the pending state of the form it sits in, so no
 * page has to thread `isPending` down by hand.
 */
export function SubmitButton({
  children,
  pendingLabel,
  className = "btn btn--primary",
  icon,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? <span className="spinner" /> : icon}
      {pending ? (pendingLabel ?? children) : children}
    </button>
  );
}
