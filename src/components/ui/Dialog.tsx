"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/ui/icons";

type DialogProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Modal built on plain elements rather than `<dialog>`, so the glass backdrop
 * and the panel can be styled and animated independently.
 *
 * Handles the three things a modal has to get right: Escape closes it, focus
 * moves inside and stays there, and the page behind does not scroll.
 *
 * Rendered through a portal into `document.body`. `position: fixed` resolves
 * against the nearest ancestor carrying a transform, filter or backdrop-filter
 * rather than the viewport — and this app has both (`.rise` animations, and
 * every `.glass` surface). Without the portal the overlay is clipped to
 * whichever card happens to contain it.
 */
export function Dialog({ title, description, onClose, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const firstField = panelRef.current?.querySelector<HTMLElement>(
      "input, textarea, select, button",
    );
    firstField?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  // Only ever rendered in response to a click, so there is no server pass to
  // mismatch against.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="dialog-backdrop"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="dialog glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="dialog__header">
          <div className="card__title">
            <h2 id={titleId} className="title-2">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
