import { MetricCard } from "./MetricCard";

type MetricDeckProps = {
  mismatch: number;
  wellbeing: number;
  activeCount: number;
  totalCount: number;
};

export function MetricDeck({ mismatch, wellbeing, activeCount, totalCount }: MetricDeckProps) {
  const mismatchDelta = 85 - mismatch;
  const wellbeingDelta = wellbeing - 35;
  const mitigationPercent = totalCount === 0 ? 0 : (activeCount / totalCount) * 100;

  let riskText = "High Mismatch";
  let riskTone: "danger" | "green" | "blue" = "danger";

  if (mismatch <= 25) {
    riskText = "Aligned";
    riskTone = "green";
  } else if (mismatch <= 55) {
    riskText = "Moderate";
    riskTone = "blue";
  }

  return (
    <div className="metrics-grid">
      <MetricCard
        label="Mismatch Index"
        value={`${mismatch}/100`}
        delta={mismatchDelta > 0 ? `-${mismatchDelta} pts` : "0 pts"}
        progress={mismatch}
        tone={mismatch > 60 ? "danger" : mismatch > 35 ? "blue" : "green"}
      />

      <MetricCard
        label="Well-Being Score"
        value={`${wellbeing}/100`}
        delta={`+${wellbeingDelta} pts`}
        progress={wellbeing}
        tone="green"
      />

      <MetricCard
        label="Active Mitigations"
        value={`${activeCount} / ${totalCount}`}
        delta=""
        progress={mitigationPercent}
        tone={riskTone}
        statusText={riskText}
      />
    </div>
  );
}
