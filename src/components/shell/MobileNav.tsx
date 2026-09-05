"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, LogoMark, MenuIcon } from "@/components/ui/icons";
import { SidebarNav } from "@/components/shell/SidebarNav";

/**
 * Hamburger plus slide-in drawer for screens below 1024px. Owns the open state
 * so the button and the panel stay in sync without lifting it into the layout.
 *
 * The drawer is portalled out of the top bar: `.topbar` is a `.glass` surface,
 * and its `backdrop-filter` would otherwise become the containing block for the
 * drawer's `position: fixed`, pinning it inside the header strip.
 */
export function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn btn--ghost btn--icon topbar__menu-button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
      >
        <MenuIcon size={20} />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <>
              <div
                className="drawer-backdrop"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <div
                className="drawer glass"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
              >
                <div className="sidebar">
                  <div className="cluster cluster--between">
                    <Link
                      href="/dashboard"
                      className="sidebar__brand"
                      onClick={() => setOpen(false)}
                    >
                      <span className="brand-mark">
                        <LogoMark size={17} />
                      </span>
                      NovaFlow
                    </Link>
                    <button
                      type="button"
                      className="btn btn--ghost btn--icon"
                      onClick={() => setOpen(false)}
                      aria-label="Close navigation"
                    >
                      <CloseIcon size={19} />
                    </button>
                  </div>

                  <SidebarNav isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
