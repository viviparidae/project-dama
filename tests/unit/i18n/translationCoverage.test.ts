import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const localesDir = path.join(__dirname, "../../../public/locales");
const files = ["common.json", "dashboard.json", "components.json"];

type JsonValue = string | number | boolean | null | JsonValue[] | Record<string, unknown>;

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.keys(obj).reduce<string[]>((acc, key) => {
    const p = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return acc.concat(flattenKeys(value as Record<string, unknown>, p));
    }
    return acc.concat(p);
  }, []);
}

function checkEmptyValues(obj: Record<string, unknown>, pathStr = ""): string[] {
  const empty: string[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const p = pathStr ? `${pathStr}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      empty.push(...checkEmptyValues(value as Record<string, unknown>, p));
    } else if (typeof value === "string" && value.trim() === "") {
      empty.push(p);
    }
  });
  return empty;
}

describe("翻訳カバレッジ", () => {
  describe("全JSONファイルが有効", () => {
    files.forEach((file) => {
      it(`${file} が有効なJSONとしてパースできること`, () => {
        const content = fs.readFileSync(path.join(localesDir, "ja", file), "utf8");
        const parsed = JSON.parse(content);
        expect(parsed).toBeInstanceOf(Object);
      });
    });
  });

  describe("ja と en のキー構成一致", () => {
    files.forEach((file) => {
      it(`${file} のja/enキーが一致すること`, () => {
        const ja = JSON.parse(fs.readFileSync(path.join(localesDir, "ja", file), "utf8"));
        const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en", file), "utf8"));
        expect(flattenKeys(ja)).toEqual(flattenKeys(en));
      });
    });
  });

  describe("日本語翻訳値の空チェック", () => {
    files.forEach((file) => {
      it(`${file} の日本語翻訳値が空文字列でないこと`, () => {
        const content = JSON.parse(fs.readFileSync(path.join(localesDir, "ja", file), "utf8"));
        const empty = checkEmptyValues(content);
        expect(empty).toEqual([]);
      });
    });
  });

  describe("ファイル間のキー重複チェック", () => {
    it("全ファイル間でキーが重複していないこと", () => {
      const allKeys: Record<string, string[]> = {};
      files.forEach((file) => {
        const content = JSON.parse(fs.readFileSync(path.join(localesDir, "ja", file), "utf8"));
        flattenKeys(content).forEach((key) => {
          if (!allKeys[key]) allKeys[key] = [];
          allKeys[key].push(file);
        });
      });
      const duplicates = Object.entries(allKeys).filter(([, filesList]) => filesList.length > 1);
      expect(duplicates).toEqual([]);
    });
  });
});