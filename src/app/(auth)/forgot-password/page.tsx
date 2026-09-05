import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <header className="stack stack--sm" style={{ marginBottom: "1.75rem" }}>
        <p className="eyebrow">Account recovery</p>
        <h1 className="title-1">Reset your password</h1>
        <p className="muted">
          Enter your email and we will send a link to choose a new password.
        </p>
      </header>

      <ForgotPasswordForm />

      <p className="muted" style={{ marginTop: "1.5rem", textAlign: "center" }}>
        Remembered it? <Link href="/login">Back to sign in</Link>
      </p>
    </>
  );
}
