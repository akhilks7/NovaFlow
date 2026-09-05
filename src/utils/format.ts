/** Presentation helpers shared by Server Components. */

/** Up to two letters for an avatar, falling back to the email local part. */
export function initials(name: string | null, email: string): string {
  const source = name?.trim() || email.split("@")[0] || "?";
  const words = source.split(/[\s._-]+/).filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
  ["#0a84ff", "#5e5ce6"],
  ["#5e5ce6", "#bf5af2"],
  ["#30d158", "#0a84ff"],
  ["#ff9f0a", "#ff375f"],
  ["#64d2ff", "#0060df"],
  ["#bf5af2", "#ff375f"],
  ["#ff375f", "#ff9f0a"],
  ["#00c7be", "#30d158"],
] as const;

/** Stable gradient per identity, so an avatar keeps its colour across sessions. */
export function avatarGradient(seed: string): { from: string; to: string } {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  const [from, to] = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  return { from, to };
}

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

export function relativeTime(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime();

  for (const [unit, size] of UNITS) {
    if (Math.abs(elapsed) >= size) {
      return RELATIVE.format(-Math.round(elapsed / size), unit);
    }
  }

  return "just now";
}

/**
 * Pinned to UTC on purpose: this runs in Client Components too, where a server
 * timezone that differs from the browser's would produce a hydration mismatch.
 */
const DATE = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return DATE.format(new Date(iso));
}

const WEEKDAY = new Intl.DateTimeFormat("en", { day: "numeric", timeZone: "UTC" });

/** Short axis label for the activity chart. */
export function chartTick(isoDate: string): string {
  return WEEKDAY.format(new Date(`${isoDate}T00:00:00Z`));
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}
