import Link from "next/link";
import type { Metadata } from "next";
import { login } from "@/utils/auth/actions";
import { Logo } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="auth-card">
      <header className="auth-head">
        <div className="logo-placeholder">
          <Logo />
        </div>
        <h1>Sign in</h1>
        <p>Use your NovaFlow Account</p>
      </header>

      <form className="auth-form" action={login}>
        {(error || message) && (
          <p className={`auth-alert${error ? " auth-alert-error" : ""}`}>{error ?? message}</p>
        )}

        <div className="input-group">
          <input type="email" id="email" name="email" placeholder=" " autoComplete="email" required />
          <label htmlFor="email">Email or phone</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder=" "
            autoComplete="current-password"
            required
          />
          <label htmlFor="password">Enter your password</label>
        </div>

        <div className="auth-actions">
          <Link href="/signup" className="btn-secondary">
            Create account
          </Link>
          <button type="submit" className="btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}