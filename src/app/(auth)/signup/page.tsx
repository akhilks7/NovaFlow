import Link from "next/link";
import type { Metadata } from "next";
import { signup } from "@/utils/auth/actions";
import { Logo } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="auth-card">
      <header className="auth-head">
        <div className="logo-placeholder">
          <Logo />
        </div>
        <h1>Create your NovaFlow Account</h1>
        <p>Start building workflows in minutes</p>
      </header>

      <form className="auth-form" action={signup}>
        {error && <p className="auth-alert auth-alert-error">{error}</p>}

        <div className="input-group">
          <input type="text" id="name" name="name" placeholder=" " autoComplete="name" required />
          <label htmlFor="name">Full name</label>
        </div>

        <div className="input-group">
          <input type="email" id="email" name="email" placeholder=" " autoComplete="email" required />
          <label htmlFor="email">Email address</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder=" "
            autoComplete="new-password"
            required
          />
          <label htmlFor="password">Create a password</label>
        </div>

        <div className="auth-actions">
          <Link href="/login" className="btn-secondary">
            Sign in instead
          </Link>
          <button type="submit" className="btn-primary">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}