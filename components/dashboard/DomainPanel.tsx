import { useTranslation } from "react-i18next";
import { InterventionItem } from "./InterventionItem";

type Intervention = {
  id: string;
  name: string;
  impact: string;
  mechanism: string;
};

type DomainPanelProps = {
  title: string;
  subtitle: string;
  trait: string;
  trigger: string;
  interventions: Intervention[];
  activeInterventions: string[];
  onToggleIntervention: (id: string) => void;
};

export function DomainPanel({
  title,
  subtitle,
  trait,
  trigger,
  interventions,
  activeInterventions,
  onToggleIntervention,
}: DomainPanelProps) {
  const { t } = useTranslation();
  return (
    <section className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
        <p className="panel-subtitle">{subtitle}</p>
      </div>

      <div className="mismatch-context-box">
        <strong>{t("panel.ancestralTrait")}</strong> {trait}
        <br />
        <strong>{t("panel.modernTrigger")}</strong> {trigger}
      </div>

      <div className="panel-header panel-header-tight">
        <span className="panel-title panel-title-grid">{t("panel.targetedInterventions")}</span>
      </div>

      <div className="interventions-list">
        {interventions.map((intervention) => (
          <InterventionItem
            key={intervention.id}
            name={intervention.name}
            impact={intervention.impact}
            checked={activeInterventions.includes(intervention.id)}
            onToggle={() => onToggleIntervention(intervention.id)}
          />
        ))}
      </div>
    </section>
  );
}