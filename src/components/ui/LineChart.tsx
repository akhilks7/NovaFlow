type LineChartProps = {
  data: { label: string; value: number }[];
  id?: string;
  height?: number;
};

export default function LineChart({ data, id = "chart-gradient", height = 220 }: LineChartProps) {
  const width = 600;
  const padX = 36;
  const padY = 24;
  const min = 0;
  const max = Math.max(...data.map((d) => d.value));
  const range = Math.max(max - min, 1);

  const x = (i: number) => padX + (i / (data.length - 1)) * (width - padX * 2);
  const y = (value: number) => height - padY - ((value - min) / range) * (height - padY * 2);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${height - padY} L${x(0)},${height - padY} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="line-chart"
      role="img"
      aria-label="Line chart"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#68c7ec" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#68c7ec" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((grid) => (
        <line
          key={grid}
          className="grid-line"
          x1={padX}
          x2={width - padX}
          y1={height * grid}
          y2={height * grid}
        />
      ))}
      <path className="area" d={area} fill={`url(#${id})`} />
      <path className="line" d={line} />
      {data.map((d, i) => (
        <g key={d.label}>
          <circle className="dot" cx={x(i)} cy={y(d.value)} r="3.5" />
          <text x={x(i)} y={height - 6} textAnchor="middle">
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}