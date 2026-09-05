"use client";

import { useEffect } from "react";
import { signout } from "@/utils/auth/actions";
import { AlertIcon, RetryIcon, SignOutIcon } from "@/components/ui/icons";

/**
 * Boundary for the authenticated area. Offers signing out as well as a retry,
 * because a stale or half-provisioned session is a common cause here and only
 * a fresh sign-in clears it.
 */
export default function AppSectionError({
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
    <div className="card glass rise" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
      <div className="empty-state__icon" style={{ margin: "0 auto 1rem" }}>
        <AlertIcon size={26} />
      </div>
      <h1 className="title-1">This page could not load</h1>
      <p className="lede" style={{ marginTop: "0.5rem" }}>
        {error.message || "Something went wrong while fetching your data."}
      </p>
      <div className="status-page__actions">
        <button type="button" className="btn btn--primary" onClick={() => retry()}>
          <RetryIcon size={17} className="btn__icon" />
          Try again
        </button>
        <form action={signout}>
          <button type="submit" className="btn btn--glass">
            <SignOutIcon size={17} className="btn__icon" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
