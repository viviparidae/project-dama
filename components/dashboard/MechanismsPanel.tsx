type Indicator = {
  name: string;
  base: string;
  active: string;
};

type Intervention = {
  id: string;
  name: string;
  mechanism: string;
};

type MechanismsPanelProps = {
  indicators: Indicator[];
  interventions: Intervention[];
  activeInterventions: string[];
};

export function MechanismsPanel({ indicators, interventions, activeInterventions }: MechanismsPanelProps) {
  const domainMechanisms = interventions.filter((intervention) => activeInterventions.includes(intervention.id));
  const domainActiveCount = domainMechanisms.length;

  return (
    <aside className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">Biological Mechanisms</h3>
        <p className="panel-subtitle">Physiological adaptations triggered by active habits.</p>
      </div>

      <div className="mechanisms-list">
        {domainMechanisms.length > 0 ? (
          domainMechanisms.map((intervention) => (
            <div key={intervention.id} className="mechanism-card">
              <span className="mechanism-tag">{intervention.name.split(" ")[0]} Mechanism</span>
              <span className="mechanism-text">{intervention.mechanism}</span>
            </div>
          ))
        ) : (
          <div className="empty-mechanisms">Toggle interventions above to reveal biological pathways.</div>
        )}
      </div>

      <div className="panel-header panel-header-tight">
        <h3 className="panel-title">Domain Indicators</h3>
      </div>

      <div className="indicators-list">
        {indicators.map((indicator) => (
          <div key={indicator.name} className="indicator-row">
            <span className="indicator-name">{indicator.name}</span>
            <span className={domainActiveCount > 0 ? "indicator-status good" : "indicator-status warning"}>
              {domainActiveCount > 0 ? indicator.active : indicator.base}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
