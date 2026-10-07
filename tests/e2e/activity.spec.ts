import { test, expect } from "@playwright/test";

const appUrl = process.env.APP_URL;
const shouldSkip = !appUrl;

test.describe("マイクロムーブ設定", () => {
  test.skip(shouldSkip, "APP_URLが指定されないためE2Eテストをスキップします");

  test("設定画面から30分の通知設定を保存できる", async ({ page }) => {
    await page.goto(appUrl!);

    await page.getByRole("button", { name: "マイクロムーブリマインド" }).click();
    await page.getByRole("button", { name: "30分" }).click();
    await page.getByRole("button", { name: "保存" }).click();

    await expect(page.getByText("設定を保存しました")).toBeVisible();
    await expect(page.getByText("30分間隔で通知します")).toBeVisible();
  });
});
