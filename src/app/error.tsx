"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertIcon, RetryIcon } from "@/components/ui/icons";

/**
 * Root error boundary. `retry` re-renders the segment on the server, which is
 * usually enough to recover from a dropped database connection.
 */
export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <div className="status-page__card glass rise">
        <div className="empty-state__icon" style={{ margin: "0 auto 1rem" }}>
          <AlertIcon size={26} />
        </div>
        <h1 className="title-1">Something went wrong</h1>
        <p className="lede" style={{ marginTop: "0.5rem" }}>
          {error.message || "The page could not be loaded."}
        </p>
        {error.digest ? (
          <p className="muted" style={{ marginTop: "0.75rem", fontSize: "0.8125rem" }}>
            Reference {error.digest}
          </p>
        ) : null}
        <div className="status-page__actions">
          <button type="button" className="btn btn--primary" onClick={() => retry()}>
            <RetryIcon size={17} className="btn__icon" />
            Try again
          </button>
          <Link href="/" className="btn btn--glass">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
