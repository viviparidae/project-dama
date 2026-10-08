type InterventionItemProps = {
  name: string;
  impact: string;
  checked: boolean;
  onToggle: () => void;
};

export function InterventionItem({ name, impact, checked, onToggle }: InterventionItemProps) {
  return (
    <button
      type="button"
      className={checked ? "intervention-item is-checked" : "intervention-item"}
      onClick={onToggle}
      aria-pressed={checked}
    >
      <div className="intervention-info">
        <span className="intervention-name">{name}</span>
        <span className="intervention-impact">{impact}</span>
      </div>
      <span className={checked ? "switch-control is-on" : "switch-control"} aria-hidden="true">
        <span className="switch-thumb" />
      </span>
    </button>
  );
}
