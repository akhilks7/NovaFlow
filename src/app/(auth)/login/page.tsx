import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <>
      <header className="stack stack--sm" style={{ marginBottom: "1.75rem" }}>
        <p className="eyebrow">Welcome back</p>
        <h1 className="title-1">Sign in to NovaFlow</h1>
      </header>

      <LoginForm next={next} initialError={error} />

      <p className="muted" style={{ marginTop: "1.5rem", textAlign: "center" }}>
        New here? <Link href="/signup">Create an account</Link>
      </p>
    </>
  );
}
