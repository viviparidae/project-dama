import { test, expect } from "@playwright/test";

test.describe("日本語UI表示", () => {
  test("ヘッダーが日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("進化的不一致エクスプロージャ")).toBeVisible();
    await expect(
      page.getByText("デジタルとフィジカルな現代人間の行動を祖先人類生物学に適合させる。")
    ).toBeVisible();
  });

  test("ドメインタブが日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "栄養" })).toBeVisible();
    await expect(page.getByRole("button", { name: "運動" })).toBeVisible();
    await expect(page.getByRole("button", { name: "光" })).toBeVisible();
    await expect(page.getByRole("button", { name: "注意" })).toBeVisible();
  });

  test("メトリクスカードが日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("不一致指数")).toBeVisible();
    await expect(page.getByText("ウェルビーイングスコア")).toBeVisible();
    await expect(page.getByText("アクティブな軽減")).toBeVisible();
  });

  test("ドメインパネルに祖先の特徴と現代のトリガーが日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("祖先の特徴:")).toBeVisible();
    await expect(page.getByText("現代のトリガー:")).toBeVisible();
    await expect(page.getByText("標的とする介入")).toBeVisible();
  });

  test("生物学的メカニズメパネルが日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("生物学的メカニズム")).toBeVisible();
    await expect(page.getByText("ドメイン指標")).toBeVisible();
  });

  test("フッターのリセットボタンが日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("全状態をリセット")).toBeVisible();
  });

  test("ロケールスイッチャーで日本語とEnglishが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "日本語" })).toBeVisible();
    await expect(page.getByRole("button", { name: "English" })).toBeVisible();
  });

  test("Englishに切り替えるとUIが英語になる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.getByText("Evolutionary Mismatch Explorer")).toBeVisible();
    await expect(page.getByRole("button", { name: "Nutrition" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Movement" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Light" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Attention" })).toBeVisible();
  });

  test("言語切替後もHTML lang属性が正しく設定される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.getByRole("button", { name: "日本語" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });

  test("Nutritionタブ選択時に「栄養と代謝」が表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "栄養" }).click();
    await expect(page.getByText("栄養と代謝")).toBeVisible();
  });

  test("介入を有効化するとメカニズムに日本語説明が表示される", async ({ page }) => {
    await page.goto("/");
    const firstIntervention = page.locator(".intervention-item").first();
    await firstIntervention.click();
    await expect(page.getByText("メカニズム")).toBeVisible();
  });

  test("Lightタブ選択時に内容が日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "光" }).click();
    await expect(page.getByText("光と概時生理学")).toBeVisible();
  });

  test("Attentionタブ選択時に内容が日本語で表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "注意" }).click();
    await expect(page.getByText("注意と社会的結びつき")).toBeVisible();
  });
});