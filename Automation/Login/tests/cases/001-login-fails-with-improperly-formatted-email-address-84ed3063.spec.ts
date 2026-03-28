import { test, expect } from "@playwright/test";

test.describe(`Login Fails with Improperly Formatted Email Address`, () => {
  test(`84ed3063-3f56-47f5-b4ad-1316996adc17`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Type \`notavalidemail@@broken\` in the email input field \`input[name='email']\``, async () => {
      await page
        .locator("input[name='email']")
        .pressSequentially("notavalidemail@@broken");
      await expect(page.locator("input[name='email']")).toHaveValue(
        "notavalidemail@@broken",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Type \`SecurePass123!\` in the password input field \`input[name='password']\``, async () => {
      await page
        .locator("input[name='password']")
        .pressSequentially("SecurePass123!");
      await expect(page.locator("input[name='password']")).toHaveAttribute(
        "type",
        "password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Click the button with text \`Sign In\``, async () => {
      await page.locator("button[type='submit']").click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the page URL remains at \`https://dev.synthqa.app/login\``, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
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
