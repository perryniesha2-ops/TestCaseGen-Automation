import { test, expect } from "@playwright/test";

test.describe(`Login Form Displays Email, Password Fields and Submit Button`, () => {
  test(`a24d2c22-4aff-4b6b-a78f-41764602e7c3`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    });

    await test.step(`Step 1: Navigate to https://dev.synthqa.app/login`, async () => {
      await page.goto("https://dev.synthqa.app/login");
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Verify element input[name='email'] is visible on the page`, async () => {
      await page.locator("input[name='email']").waitFor({ state: "visible" });
      await expect(page.locator("input[name='email']")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Verify element input[name='password'] is visible on the page`, async () => {
      await page
        .locator("input[name='password']")
        .waitFor({ state: "visible" });
      await expect(page.locator("input[name='password']")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Verify element input[type='password'] has attribute type equal to password`, async () => {
      await page
        .locator("input[type='password']")
        .waitFor({ state: "visible" });
      await expect(page.locator("input[type='password']")).toHaveAttribute(
        "type",
        "password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the button with text Sign In is visible on the page`, async () => {
      await page.locator("button[type='submit']").waitFor({ state: "visible" });
      await expect(page.locator("button[type='submit']")).toBeVisible();

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
