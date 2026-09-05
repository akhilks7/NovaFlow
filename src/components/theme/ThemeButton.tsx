"use client";

import { useState, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import {
  applyTheme,
  getSystemTheme,
  getSystemThemeOnServer,
  subscribeToSystemTheme,
  type ThemePreference,
} from "@/components/theme/theme";

/**
 * One-tap light/dark switch for the top bar.
 *
 * When the stored preference is `system`, the device setting is read through
 * `useSyncExternalStore` — the server renders `null` and the client fills it in
 * after hydration, with no mismatch and no state-syncing effect.
 */
export function ThemeButton({ preference }: { preference: ThemePreference }) {
  const [override, setOverride] = useState<ThemePreference | null>(null);

  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getSystemThemeOnServer,
  );

  const active = override ?? preference;
  const resolved = active === "system" ? systemTheme : active;

  function toggle() {
    const next: ThemePreference = resolved === "dark" ? "light" : "dark";
    setOverride(next);
    applyTheme(next);
  }

  // Before the system value arrives, offer dark — the more common request.
  const goingDark = resolved !== "dark";

  return (
    <button
      type="button"
      className="btn btn--ghost btn--icon"
      onClick={toggle}
      aria-label={goingDark ? "Switch to dark appearance" : "Switch to light appearance"}
      title={goingDark ? "Dark appearance" : "Light appearance"}
    >
      {goingDark ? <MoonIcon size={18} /> : <SunIcon size={18} />}
    </button>
  );
}
