import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("i18n 設定", () => {
  const i18nPath = path.join(__dirname, "../../../app/i18n.ts");
  const content = fs.readFileSync(i18nPath, "utf8");

  it("HttpBackend が import されていること", () => {
    expect(content).toContain('import HttpBackend from "i18next-http-backend"');
  });

  it(".use(HttpBackend) が呼ばれていること", () => {
    expect(content).toContain(".use(HttpBackend)");
  });

  it("backend.loadPath が設定されていること", () => {
    expect(content).toContain("loadPath");
  });

  it("fallbackLng: ja が設定されていること", () => {
    expect(content).toContain('fallbackLng: "ja"');
  });
});

describe("Server Component 安全チェック", () => {
  it("layout.tsx に import \"./i18n\" が存在しないこと", () => {
    const layoutPath = path.join(__dirname, "../../../app/layout.tsx");
    const content = fs.readFileSync(layoutPath, "utf8");
    expect(content).not.toContain('import "./i18n"');
  });

  it("page.tsx に import \"./i18n\" が存在すること", () => {
    const pagePath = path.join(__dirname, "../../../app/page.tsx");
    const content = fs.readFileSync(pagePath, "utf8");
    expect(content).toContain('import "./i18n"');
  });
});