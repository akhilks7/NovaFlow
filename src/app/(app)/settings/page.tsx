import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PasswordForm } from "@/components/settings/PasswordForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isThemePreference, THEME_COOKIE } from "@/components/theme/theme";
import { SignOutIcon } from "@/components/ui/icons";
import { requireProfile } from "@/utils/auth/dal";
import { signout } from "@/utils/auth/actions";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const profile = await requireProfile();
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const preference = isThemePreference(stored) ? stored : "system";

  return (
    <div className="stack stack--lg rise">
      <header className="page-header">
        <div className="page-header__text">
          <p className="eyebrow">Preferences</p>
          <h1 className="title-1">Settings</h1>
          <p className="muted">Appearance, security and session.</p>
        </div>
      </header>

      <section className="card glass">
        <div className="card__header">
          <div className="card__title">
            <h2 className="title-2">Appearance</h2>
            <p className="muted">
              Choose a fixed theme, or follow your device automatically.
            </p>
          </div>
          <ThemeToggle preference={preference} />
        </div>
      </section>

      <div className="split">
        <section className="card glass">
          <div className="card__header">
            <div className="card__title">
              <h2 className="title-2">Password</h2>
              <p className="muted">
                Confirm your current password to set a new one.
              </p>
            </div>
          </div>
          <PasswordForm />
        </section>

        <section className="card glass">
          <div className="card__header">
            <div className="card__title">
              <h2 className="title-2">Session</h2>
              <p className="muted">Signed in as {profile.email}.</p>
            </div>
          </div>

          <form action={signout}>
            <button type="submit" className="btn btn--danger btn--block">
              <SignOutIcon size={17} className="btn__icon" />
              Sign out
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
