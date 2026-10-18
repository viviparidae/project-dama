#!/usr/bin/env node
/**
 * Merge translation source files into a single translation.json for each locale.
 * Run: npm run i18n:merge
 */
const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "../public/locales");
const files = ["common.json", "dashboard.json", "components.json"];

function deepMerge(target, source) {
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  });
}

function wrapContent(content, filename) {
  return filename === "dashboard.json" ? { dashboard: content } : content;
}

["ja", "en"].forEach((lang) => {
  const translation = {};
  files.forEach((file) => {
    const content = JSON.parse(
      fs.readFileSync(path.join(localesDir, lang, file), "utf8")
    );
    deepMerge(translation, wrapContent(content, file));
  });
  fs.writeFileSync(
    path.join(localesDir, lang, "translation.json"),
    JSON.stringify(translation, null, 2) + "\n",
    "utf8"
  );
  console.log("Generated: locales/" + lang + "/translation.json");
});