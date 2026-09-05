import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CompassIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="status-page">
      <div className="status-page__card glass rise">
        <div className="empty-state__icon" style={{ margin: "0 auto 1rem" }}>
          <CompassIcon size={26} />
        </div>
        <p className="status-page__code gradient-text">404</p>
        <h1 className="title-1">Oops — wrong page</h1>
        <p className="lede" style={{ marginTop: "0.5rem" }}>
          This link points somewhere that does not exist. It may have been renamed,
          or the address has a typo in it.
        </p>
        <div className="status-page__actions">
          <Link href="/dashboard" className="btn btn--primary">
            Go to dashboard
            <ArrowRightIcon size={17} className="btn__icon" />
          </Link>
          <Link href="/" className="btn btn--glass">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
