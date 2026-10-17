import { useTranslation } from "react-i18next";

type FooterSummaryProps = {
  summaryKey: string;
  summaryValues: Record<string, string | number>;
  onReset: () => void;
};

export function FooterSummary({ summaryKey, summaryValues, onReset }: FooterSummaryProps) {
  const { t } = useTranslation();
  return (
    <footer className="footer-deck">
      <div className="footer-info">{t(summaryKey, summaryValues)}</div>
      <button type="button" className="reset-btn" onClick={onReset}>
        {t("footerSummary.resetButton")}
      </button>
    </footer>
  );
}