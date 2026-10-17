import { describe, it, expect, beforeEach } from "vitest";
import i18n from "i18next";

describe("日本語翻訳レイヤー", () => {
  beforeEach(() => {
    i18n.changeLanguage("ja");
  });

  describe("共通翻訳 (common.json)", () => {
    it("アプリタイトルが日本語で取得できること", () => {
      expect(i18n.t("app.title")).toBe("DAMA Dashboard");
    });

    it("ロケールスイッチャー「日本語」が正しいこと", () => {
      expect(i18n.t("localeSwitcher.ja")).toBe("日本語");
    });

    it("ロケールスイッチャー「English」が正しいこと", () => {
      expect(i18n.t("localeSwitcher.en")).toBe("English");
    });

    it("パネル「祖先の特徴:」が正しいこと", () => {
      expect(i18n.t("panel.ancestralTrait")).toBe("祖先の特徴:");
    });

    it("パネル「現代のトリガー:」が正しいこと", () => {
      expect(i18n.t("panel.modernTrigger")).toBe("現代のトリガー:");
    });

    it("パネル「標的とする介入」が正しいこと", () => {
      expect(i18n.t("panel.targetedInterventions")).toBe("標的とする介入");
    });

    it("メトリクスカード「不一致指数」が正しいこと", () => {
      expect(i18n.t("metricDeck.label.mismatch")).toBe("不一致指数");
    });

    it("メカニズムパネル「生物学的メカニズム」が正しいこと", () => {
      expect(i18n.t("mechanismsPanel.title")).toBe("生物学的メカニズム");
    });

    it("メカニズムパネル「ドメイン指標」が正しいこと", () => {
      expect(i18n.t("mechanismsPanel.domainIndicators")).toBe("ドメイン指標");
    });

    it("メカニズムパネル「アクティブな習慣によって引き起こされる生理的適応。」が正しいこと", () => {
      expect(i18n.t("mechanismsPanel.subtitle")).toBe("アクティブな習慣によって引き起こされる生理的適応。");
    });

    it("フッター「全状態をリセット」が正しいこと", () => {
      expect(i18n.t("footerSummary.resetButton")).toBe("全状態をリセット");
    });
  });

  describe("ダッシュボード翻訳 (dashboard.json)", () => {
    it("ナビゲーションタイトルが日本語であること", () => {
      expect(i18n.t("dashboard.nav.title")).toBe("進化的不一致エクスプロージャ");
    });

    it("タブ「栄養」が正しいこと", () => {
      expect(i18n.t("dashboard.tabs.nutrition")).toBe("栄養");
    });

    it("タブ「運動」が正しいこと", () => {
      expect(i18n.t("dashboard.tabs.movement")).toBe("運動");
    });

    it("タブ「光」が正しいこと", () => {
      expect(i18n.t("dashboard.tabs.light")).toBe("光");
    });

    it("タブ「注意」が正しいこと", () => {
      expect(i18n.t("dashboard.tabs.attention")).toBe("注意");
    });
  });

  describe("コンポーネント翻訳 (components.json)", () => {
    it("ドメイン「栄養と代謝」が正しいこと", () => {
      expect(i18n.t("domains.nutrition.title")).toBe("栄養と代謝");
    });

    it("ドメイン「運動と生物力学」が正しいこと", () => {
      expect(i18n.t("domains.movement.title")).toBe("運動と生物力学");
    });

    it("ドメイン「光と概時生理学」が正しいこと", () => {
      expect(i18n.t("domains.light.title")).toBe("光と概時生理学");
    });

    it("ドメイン「注意と社会的結びつき」が正しいこと", () => {
      expect(i18n.t("domains.attention.title")).toBe("注意と社会的結びつき");
    });

    it("介入名「概日リズム断食（12-14時間）」が正しいこと", () => {
      expect(i18n.t("interventions.nutr_circadian.name")).toBe("概日リズム断食（12-14時間）");
    });

    it("指標名「食後血糖値急上昇」が正しいこと", () => {
      expect(i18n.t("indicators.postprandial.name")).toBe("食後血糖値急上昇");
    });
  });

  describe("言語切り替え", () => {
    it("日本語から英語に切り替えられること", () => {
      expect(i18n.t("dashboard.nav.title")).toBe("進化的不一致エクスプロージャ");
      i18n.changeLanguage("en");
      expect(i18n.t("dashboard.nav.title")).toBe("Evolutionary Mismatch Explorer");
    });

    it("英語から日本語に戻せること", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("dashboard.nav.title")).toBe("Evolutionary Mismatch Explorer");
      i18n.changeLanguage("ja");
      expect(i18n.t("dashboard.nav.title")).toBe("進化的不一致エクスプロージャ");
    });
  });
});