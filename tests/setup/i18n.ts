import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { beforeAll } from "vitest";
import fs from "fs";
import path from "path";

beforeAll(async () => {
  const localesDir = path.join(__dirname, "../../public/locales");
  const files = ["common.json", "dashboard.json", "components.json"];

  // dashboard.json → { dashboard: { nav: {...} } } にラップ
  // 他のファイルはそのままマージ
  function wrapContent(content: Record<string, unknown>, filename: string) {
    if (filename === "dashboard.json") return { dashboard: content };
    return content;
  }

  const mergeContent: Record<string, Record<string, unknown>> = {};
  ["ja", "en"].forEach((lang) => {
    const translation: Record<string, unknown> = {};
    files.forEach((file) => {
      const content = JSON.parse(
        fs.readFileSync(path.join(localesDir, lang, file), "utf8")
      ) as Record<string, unknown>;
      const wrapped = wrapContent(content, file);
      deepMerge(translation, wrapped);
    });
    mergeContent[lang] = translation;
  });

  const resources: Record<string, Record<string, Record<string, unknown>>> = {};
  Object.entries(mergeContent).forEach(([lang, content]) => {
    resources[lang] = { translation: content };
  });

  await i18n.use(initReactI18next).init({
    fallbackLng: "ja",
    lng: "ja",
    resources,
    interpolation: { escapeValue: false },
  });
});

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepMerge(target[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      target[key] = value;
    }
  });
}