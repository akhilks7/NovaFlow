"use client";

import { useEffect } from "react";
import { AlertIcon, RetryIcon } from "@/components/ui/icons";
import "./globals.css";

/**
 * Last-resort boundary: catches failures in the root layout itself, so it has
 * to render its own document shell.
 *
 * The theme cookie is unreachable from here, so the palette falls back to the
 * operating system's `prefers-color-scheme`.
 */
export default function GlobalError({
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
    <html lang="en">
      <body>
        <div className="ambient" aria-hidden="true" />
        <main className="status-page">
          <div className="status-page__card glass">
            <div className="empty-state__icon" style={{ margin: "0 auto 1rem" }}>
              <AlertIcon size={26} />
            </div>
            <h1 className="title-1">NovaFlow could not start</h1>
            <p className="lede" style={{ marginTop: "0.5rem" }}>
              An unexpected error stopped the app from rendering. Reloading usually
              clears it.
            </p>
            {error.digest ? (
              <p
                className="muted"
                style={{ marginTop: "0.75rem", fontSize: "0.8125rem" }}
              >
                Reference {error.digest}
              </p>
            ) : null}
            <div className="status-page__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => retry()}
              >
                <RetryIcon size={17} className="btn__icon" />
                Reload
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
