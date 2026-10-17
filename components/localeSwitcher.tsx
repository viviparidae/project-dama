import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const LocaleSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Update HTML lang attribute
    document.documentElement.lang = lng;
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("ja")}
        className={i18n.language === "ja"
          ? "bg-blue-600 text-white px-3 py-1 rounded"
          : "text-gray-600 hover:text-gray-900 px-3 py-1 rounded"}
      >
        {t("localeSwitcher.ja")}
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={i18n.language === "en"
          ? "bg-blue-600 text-white px-3 py-1 rounded"
          : "text-gray-600 hover:text-gray-900 px-3 py-1 rounded"}
      >
        {t("localeSwitcher.en")}
      </button>
    </div>
  );
};