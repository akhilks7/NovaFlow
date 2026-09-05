export type ThemePreference = "light" | "dark" | "system";

export const THEME_COOKIE = "theme";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Applies a preference in the browser.
 *
 * The attribute flips the CSS custom properties immediately (no repaint delay,
 * no flash), and the cookie lets the server render the same attribute on the
 * next request so the choice survives a reload.
 */
export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;

  if (preference === "system") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = preference;
  }

  document.cookie = `${THEME_COOKIE}=${preference}; path=/; max-age=31536000; samesite=lax`;
}

const SYSTEM_DARK = "(prefers-color-scheme: dark)";

/**
 * `matchMedia` as an external store, so components can read the system theme
 * through `useSyncExternalStore` instead of syncing it into state in an effect.
 */
export function subscribeToSystemTheme(onChange: () => void): () => void {
  const query = window.matchMedia(SYSTEM_DARK);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function getSystemTheme(): "light" | "dark" {
  return window.matchMedia(SYSTEM_DARK).matches ? "dark" : "light";
}

/** The server cannot know the device preference. */
export function getSystemThemeOnServer(): null {
  return null;
}
