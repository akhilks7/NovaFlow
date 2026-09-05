import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <>
      <header className="stack stack--sm" style={{ marginBottom: "1.75rem" }}>
        <p className="eyebrow">Get started</p>
        <h1 className="title-1">Create your account</h1>
      </header>

      <SignupForm />

      <p className="muted" style={{ marginTop: "1.5rem", textAlign: "center" }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
