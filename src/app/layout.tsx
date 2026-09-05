import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { isThemePreference, THEME_COOKIE } from "@/components/theme/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NovaFlow",
    template: "%s · NovaFlow",
  },
  description:
    "NovaFlow — build, run, and monitor automated workflows with your team.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaeef6" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Reading the preference here means the correct palette is in the first byte
  // of HTML — no blocking inline script, and no flash of the wrong theme.
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const preference = isThemePreference(stored) ? stored : "system";

  return (
    <html lang="en" data-theme={preference === "system" ? undefined : preference}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="ambient" aria-hidden="true">
          <span className="ambient__grain" />
        </div>
        {children}
      </body>
    </html>
  );
}
