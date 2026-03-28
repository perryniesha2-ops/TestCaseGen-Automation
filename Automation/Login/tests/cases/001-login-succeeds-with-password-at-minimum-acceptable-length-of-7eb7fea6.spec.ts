import { test, expect } from "@playwright/test";

test.describe(`Login Succeeds with Password at Minimum Acceptable Length of 8 Characters`, () => {
  test(`7eb7fea6-6a73-4550-ba07-59e5da5f9bbc`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Type boundary.user@testcompany.com in the email input field input[name='email']`, async () => {
      await page
        .locator("input[name='email']")
        .fill(process.env.TEST_USER_EMAIL || "boundary.user@testcompany.com");
      await expect(page.locator("input[name='email']")).toHaveValue(
        process.env.TEST_USER_EMAIL || "boundary.user@testcompany.com",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Type Pass1!ab (8 characters) in the password input field input[name='password']`, async () => {
      await page
        .locator("input[name='password']")
        .fill(process.env.TEST_USER_PASSWORD || "Pass1!ab");
      await expect(page.locator("input[name='password']")).toHaveAttribute(
        "type",
        "password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Click the button with text Sign In`, async () => {
      await page.locator("button:has-text('Sign In')").click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/dashboard/);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the page URL contains /dashboard`, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/dashboard/);

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
