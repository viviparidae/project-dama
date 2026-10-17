import { MetricCard } from "./MetricCard";
import { t } from "../../src/lib/i18n";

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

  let riskText = t("metricDeck.highMismatch");
  let riskTone: "danger" | "green" | "blue" = "danger";

  if (mismatch <= 25) {
    riskText = t("metricDeck.aligned");
    riskTone = "green";
  } else if (mismatch <= 55) {
    riskText = t("metricDeck.moderate");
    riskTone = "blue";
  }

  return (
    <div className="metrics-grid">
      <MetricCard
        label={t("metricDeck.mismatchIndex")}
        value={`${mismatch}/100`}
        delta={mismatchDelta > 0 ? `-${mismatchDelta} pts` : "0 pts"}
        progress={mismatch}
        tone={mismatch > 60 ? "danger" : mismatch > 35 ? "blue" : "green"}
      />

      <MetricCard
        label={t("metricDeck.wellBeingScore")}
        value={`${wellbeing}/100`}
        delta={`+${wellbeingDelta} pts`}
        progress={wellbeing}
        tone="green"
      />

      <MetricCard
        label={t("metricDeck.activeMitigations")}
        value={`${activeCount} / ${totalCount}`}
        delta=""
        progress={mitigationPercent}
        tone={riskTone}
        statusText={riskText}
      />
    </div>
  );
}
