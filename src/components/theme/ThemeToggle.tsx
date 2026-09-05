"use client";

import { useState } from "react";
import { MoonIcon, SunIcon, SystemIcon } from "@/components/ui/icons";
import { applyTheme, type ThemePreference } from "@/components/theme/theme";

const OPTIONS = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "system", label: "System", Icon: SystemIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
] as const satisfies readonly { value: ThemePreference; label: string; Icon: typeof SunIcon }[];

/**
 * Three-way appearance control. Starts from the server-rendered preference, so
 * there is nothing to reconcile on hydration.
 */
export function ThemeToggle({ preference }: { preference: ThemePreference }) {
  const [selected, setSelected] = useState<ThemePreference>(preference);

  function choose(next: ThemePreference) {
    setSelected(next);
    applyTheme(next);
  }

  return (
    <div className="segmented" role="radiogroup" aria-label="Appearance">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={selected === value}
          className="segmented__option"
          onClick={() => choose(value)}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  );
}
