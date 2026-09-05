import type { ReactNode } from "react";

type StatTileProps = {
  label: string;
  value: number | string;
  icon: ReactNode;
  hint?: string;
};

export function StatTile({ label, value, icon, hint }: StatTileProps) {
  return (
    <article className="card glass card--interactive">
      <div className="stat">
        <div className="stat__head">
          <p className="stat__label">{label}</p>
          <span className="stat__icon">{icon}</span>
        </div>
        <p className="stat__value">{value}</p>
        {hint ? <p className="stat__label">{hint}</p> : null}
      </div>
    </article>
  );
}
