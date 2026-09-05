type BarChartProps = {
  data: { label: string; value: number }[];
  height?: number;
};

export default function BarChart({ data, height = 80 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bar-chart" style={{ height }} role="img" aria-label="Bar chart">
      {data.map((d) => (
        <span
          key={d.label}
          className="bar"
          style={{ height: `${Math.round((d.value / max) * 100)}%` }}
          title={d.label}
        />
      ))}
    </div>
  );
}