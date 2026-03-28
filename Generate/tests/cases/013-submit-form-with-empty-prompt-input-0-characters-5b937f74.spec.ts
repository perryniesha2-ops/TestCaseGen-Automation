import { test, expect } from "../fixtures";

test.describe(`Submit form with empty prompt input (0 characters)`, () => {
  test(`5b937f74-7b85-4df4-9051-9fa84615cf64`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    });

    await test.step(`Step 1: Navigate to https://dev.synthqa.app/generate`, async () => {
      await page.goto("https://dev.synthqa.app/generate");
      await expect(page).toHaveURL(/https:\/\/dev.synthqa.app\/generate/);

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Type generation title`, async () => {
      await page.locator("input#title").fill("Coupon Code Test");
      await expect(page.locator("input#title")).toHaveValue("Coupon Code Test");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Type generation description`, async () => {
      await page
        .locator("input#description")
        .fill("Testing discount coupon code functionality on checkout page");
      await expect(page.locator("input#description")).toHaveValue(
        "Testing discount coupon code functionality on checkout page",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Ensure the prompt/description textarea is empty (clear any pre-filled content)`, async () => {
      await page.locator("textarea#custom-requirements").fill("");
      await expect(page.locator("textarea#custom-requirements")).toHaveValue(
        "",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Click submit button`, async () => {
      await page.locator("button[type='submit']").click();
      await expect(page.locator("button[type='submit']")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify URL contains '/generate'`, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await expect(page).toHaveURL(/\/generate/);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
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
