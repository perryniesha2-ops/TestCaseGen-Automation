import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["0170af81-cecf-46a7-96ea-bf590b6a0840"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Re-submission of login form after failed authentication attempt without changing credentials does not cause silent failure or UI freeze`, () => {
  test(`0170af81-cecf-46a7-96ea-bf590b6a0840`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");


    await test.step(`Step 1: Navigate to the login page`, async () => {
        await page.goto(baseUrl + '/login');
        await expect(page).toHaveURL(baseUrl + '/login');

        await page.screenshot({
          path: testInfo.outputPath(`step-1.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 2: Fill in the email field with an existing account email`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'diana.moreau@acmecorp.io');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('diana.moreau@acmecorp.io');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the password field with an incorrect password`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'W1nter$unset99');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the submit button to trigger first failed login attempt`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for the error message to appear after the first failed attempt`, async () => {
        await page.locator('[data-testid=\'login-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        await expect(page.locator('[data-testid=\'login-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Verify the submit button is still enabled and interactive after the first failure`, async () => {
        await page.locator('[data-testid=\'submit-button\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid=\'submit-button\']')).toBeEnabled();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Click the submit button again WITHOUT changing any field values`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 8: Wait for the error message to reappear after the second failed attempt`, async () => {
        await page.locator('[data-testid=\'login-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await expect(page.locator('[data-testid=\'login-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-8.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 9: Verify the submit button is still enabled after second failure`, async () => {
        await page.locator('[data-testid=\'submit-button\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid=\'submit-button\']')).toBeEnabled();

        await page.screenshot({
          path: testInfo.outputPath(`step-9.png`),
          fullPage: true,
        });
    });

    await test.step("Final state", async () => {
      await page.screenshot({
        path: testInfo.outputPath("final.png"),
        fullPage: true,
      });
    });
  });
});
