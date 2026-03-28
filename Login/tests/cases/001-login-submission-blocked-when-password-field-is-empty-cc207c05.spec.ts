import { test, expect } from "@playwright/test";

test.describe(`Login Submission Blocked When Password Field Is Empty`, () => {
  test(`cc207c05-c716-420e-9a7b-3b785c645aa3`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Type john.doe@testcompany.com in the email input field`, async () => {
      await page
        .locator("input[name='email']")
        .pressSequentially(
          process.env.TEST_USER_EMAIL || "john.doe@testcompany.com",
        );
      await expect(page.locator("input[name='email']")).toHaveValue(
        process.env.TEST_USER_EMAIL || "john.doe@testcompany.com",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Leave the password input field empty`, async () => {
      await page
        .locator("input[name='password']")
        .waitFor({ state: "visible" });
      await expect(page.locator("input[name='password']")).toHaveValue("");

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Click the button with text Sign In`, async () => {
      await page.locator("button[type='submit']").click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the page URL remains at https://dev.synthqa.app/login`, async () => {
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
