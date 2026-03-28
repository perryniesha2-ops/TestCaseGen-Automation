import { test, expect } from "@playwright/test";

test.describe(`Attempt to Access AI Test Case Generator Without Authentication`, () => {
  test(`48ca6010-e1b4-48f4-b369-20930f1bb739`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    });

    await test.step(`Step 1: Navigate to https://dev.synthqa.app/generate`, async () => {
      await page.goto("https://dev.synthqa.app/generate");
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Verify URL contains '/login'`, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Verify text 'Sign In' is visible`, async () => {
      await page.locator('button[type="submit"]').waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      await expect(page.locator('button[type="submit"]')).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Navigate to https://dev.synthqa.app/generate`, async () => {
      await page.goto("https://dev.synthqa.app/generate");
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify URL contains '/login'`, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step("Expected Result", async () => {
      await page.screenshot({
        path: testInfo.outputPath("final.png"),
        fullPage: true,
      });
    });
  });
});
