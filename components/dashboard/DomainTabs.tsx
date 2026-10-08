type DomainTabItem = {
  key: string;
  label: string;
};

type DomainTabsProps = {
  items: DomainTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export function DomainTabs({ items, activeKey, onChange }: DomainTabsProps) {
  return (
    <nav className="domain-tabs" aria-label="Life domains">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={activeKey === item.key ? "domain-tab is-active" : "domain-tab"}
          data-domain={item.key}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
