type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
  progress: number;
  tone: "danger" | "green" | "blue";
  statusText?: string;
};

const toneColors: Record<MetricCardProps["tone"], string> = {
  danger: "var(--error)",
  green: "var(--positive)",
  blue: "var(--primary)",
};

export function MetricCard({ label, value, delta, progress, tone, statusText }: MetricCardProps) {
  const barColor = toneColors[tone];
  const deltaClassName = delta.startsWith("-") || delta === "0 pts" ? "metric-change" : "metric-change positive";

  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <div className="metric-val-row">
        <span className="metric-value">{value}</span>
        {delta ? <span className={deltaClassName}>{delta}</span> : null}
      </div>
      <div className="meter-bar-bg">
        <div className="meter-bar-fill" style={{ width: `${progress}%`, backgroundColor: barColor }} />
      </div>
      {statusText ? (
        <div className="metric-status-text" style={{ color: barColor }}>
          {statusText}
        </div>
      ) : null}
    </div>
  );
}
