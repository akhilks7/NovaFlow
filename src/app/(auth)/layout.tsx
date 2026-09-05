import type { ReactNode } from "react";
import Link from "next/link";
import { BoltIcon, LockIcon, LogoMark, TeamIcon } from "@/components/ui/icons";

const HIGHLIGHTS = [
  {
    Icon: BoltIcon,
    title: "Automations that explain themselves",
    body: "Every run, every change, recorded in one readable timeline.",
  },
  {
    Icon: TeamIcon,
    title: "Roles that hold up",
    body: "Admins manage the directory; members keep their own workspace.",
  },
  {
    Icon: LockIcon,
    title: "Enforced in the database",
    body: "Row level security guards the data, not just the interface.",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="auth">
      {/* Decorative panel; hidden below 960px so the form owns small screens. */}
      <aside className="auth__aside glass">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <LogoMark size={17} />
          </span>
          NovaFlow
        </Link>

        <div className="stack">
          <h2 className="title-1">
            Workflow automation your whole team can <span className="gradient-text">actually read</span>.
          </h2>
          <ul className="auth__highlights">
            {HIGHLIGHTS.map(({ Icon, title, body }) => (
              <li key={title}>
                <span className="feed__marker">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="title-3">{title}</p>
                  <p className="muted" style={{ fontSize: "0.875rem" }}>
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="muted" style={{ fontSize: "0.8125rem" }}>
          The first account created becomes the workspace administrator.
        </p>
      </aside>

      <section className="auth__panel">
        <div className="auth__panel-inner">
          <Link href="/" className="brand auth__mobile-brand">
            <span className="brand-mark">
              <LogoMark size={17} />
            </span>
            NovaFlow
          </Link>
          <div className="auth__card glass rise">{children}</div>
        </div>
      </section>
    </main>
  );
}
