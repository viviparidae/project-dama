import { t } from "../../src/lib/i18n";

type FooterSummaryProps = {
  summaryText: string;
  onReset: () => void;
};

export function FooterSummary({ summaryText, onReset }: FooterSummaryProps) {
  return (
    <footer className="footer-deck">
      <div className="footer-info">{summaryText}</div>
      <button type="button" className="reset-btn" onClick={onReset}>
        {t("common.resetAllStates")}
      </button>
    </footer>
  );
}
