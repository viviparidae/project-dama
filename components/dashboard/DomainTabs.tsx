import { useTranslation } from "react-i18next";

type DomainTabItem = {
  key: string;
  labelKey: string;
};

type DomainTabsProps = {
  items: DomainTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export function DomainTabs({ items, activeKey, onChange }: DomainTabsProps) {
  const { t } = useTranslation();
  return (
    <nav className="domain-tabs" aria-label={t("domainTabs.label")}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={activeKey === item.key ? "domain-tab is-active" : "domain-tab"}
          data-domain={item.key}
          onClick={() => onChange(item.key)}
        >
          {t(item.labelKey)}
        </button>
      ))}
    </nav>
  );
}