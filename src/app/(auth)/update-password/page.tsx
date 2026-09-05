import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
};

export default function UpdatePasswordPage() {
  return (
    <>
      <header className="stack stack--sm" style={{ marginBottom: "1.75rem" }}>
        <p className="eyebrow">Almost done</p>
        <h1 className="title-1">Choose a new password</h1>
        <p className="muted">
          You are signed in from the recovery link. Pick a new password to finish.
        </p>
      </header>

      <UpdatePasswordForm />
    </>
  );
}
