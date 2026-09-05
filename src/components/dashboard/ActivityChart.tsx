import { chartTick } from "@/utils/format";
import type { ActivityDay } from "@/utils/dashboard/queries";

/**
 * Fortnight of activity as a bar chart. Plain elements rather than a charting
 * library — the shape is simple enough that the markup is smaller than the
 * dependency would be.
 */
export function ActivityChart({ series }: { series: ActivityDay[] }) {
  const peak = Math.max(1, ...series.map((day) => day.count));
  const total = series.reduce((sum, day) => sum + day.count, 0);

  return (
    <div>
      <div
        className="chart"
        role="img"
        aria-label={`${total} ${total === 1 ? "event" : "events"} over the last ${series.length} days`}
      >
        {series.map((day, index) => (
          <div className="chart__col" key={day.date}>
            <div
              className={day.count > 0 ? "chart__bar" : "chart__bar chart__bar--empty"}
              style={{
                height: `${Math.max(3, (day.count / peak) * 100)}%`,
                animationDelay: `${index * 24}ms`,
              }}
              title={`${day.date}: ${day.count}`}
            />
          </div>
        ))}
      </div>

      <div className="chart__axis" aria-hidden="true">
        {series.map((day) => (
          <span className="chart__tick" key={day.date}>
            {chartTick(day.date)}
          </span>
        ))}
      </div>
    </div>
  );
}
