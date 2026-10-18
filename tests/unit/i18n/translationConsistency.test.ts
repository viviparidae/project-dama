import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

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

function buildTranslation(lang: string) {
  const localesDir = path.join(__dirname, "../../../public/locales", lang);
  const files = ["common.json", "dashboard.json", "components.json"];
  const translation: Record<string, unknown> = {};
  files.forEach((file) => {
    const content = JSON.parse(
      fs.readFileSync(path.join(localesDir, file), "utf8")
    ) as Record<string, unknown>;
    const wrapped = file === "dashboard.json" ? { dashboard: content } : content;
    deepMerge(translation, wrapped);
  });
  return translation;
}

describe("翻訳ファイルの一貫性", () => {
  it("ja/translation.json がソースファイルと一致すること", () => {
    const generated = buildTranslation("ja");
    const actual = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../../public/locales/ja/translation.json"), "utf8")
    );
    expect(actual).toEqual(generated);
  });

  it("en/translation.json がソースファイルと一致すること", () => {
    const generated = buildTranslation("en");
    const actual = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../../public/locales/en/translation.json"), "utf8")
    );
    expect(actual).toEqual(generated);
  });
});

describe("翻訳ファイルの到達可能性", () => {
  it("/locales/ja/translation.json が存在すること", () => {
    expect(
      fs.existsSync(path.join(__dirname, "../../../public/locales/ja/translation.json"))
    ).toBe(true);
  });

  it("/locales/en/translation.json が存在すること", () => {
    expect(
      fs.existsSync(path.join(__dirname, "../../../public/locales/en/translation.json"))
    ).toBe(true);
  });
});