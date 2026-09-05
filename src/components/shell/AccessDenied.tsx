import Link from "next/link";
import { ArrowRightIcon, ShieldIcon } from "@/components/ui/icons";

/**
 * Shown instead of an admin page when a member reaches one. Rendered rather
 * than redirected, so the address bar keeps the URL they tried and the reason
 * is explicit.
 */
export function AccessDenied() {
  return (
    <div className="card glass rise" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
      <div className="empty-state__icon" style={{ margin: "0 auto 1rem" }}>
        <ShieldIcon size={26} />
      </div>
      <p className="eyebrow">403 · Restricted</p>
      <h1 className="title-1" style={{ marginTop: "0.35rem" }}>
        Administrators only
      </h1>
      <p className="lede" style={{ marginTop: "0.5rem", maxWidth: "42ch", marginInline: "auto" }}>
        Managing members needs an administrator account. Ask an admin if you
        think you should have access.
      </p>
      <div className="status-page__actions">
        <Link href="/dashboard" className="btn btn--primary">
          Back to dashboard
          <ArrowRightIcon size={17} className="btn__icon" />
        </Link>
      </div>
    </div>
  );
}
