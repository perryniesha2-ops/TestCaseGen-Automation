import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["1ca59502-c5ca-4852-bd2c-3c9fa3474449"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Successful Login with Email Persists Authenticated Session Across Page Refresh`, () => {
  test(`1ca59502-c5ca-4852-bd2c-3c9fa3474449`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the email address field`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'margaret.holloway@acmecorp.io');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('margaret.holloway@acmecorp.io');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the password field`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'Tr0ub4dor&3!Zx');
        await expect(page.locator('input[type=\'password\']')).toHaveValue('Tr0ub4dor&3!Zx');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the Sign In / Submit button`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();
        await expect(page).toHaveURL(baseUrl + '/dashboard');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify the authenticated user's name or avatar is visible in the UI`, async () => {
        await page.locator('[data-testid=\'user-menu\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        await expect(page.locator('[data-testid=\'user-menu\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Perform a hard page reload to test session persistence`, async () => {
        await page.locator('body').press('F5');
        await expect(page).toHaveURL(baseUrl + '/dashboard');

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Confirm user menu is still visible after reload, confirming session was persisted`, async () => {
        await page.locator('[data-testid=\'user-menu\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(2000);
        await expect(page.locator('[data-testid=\'user-menu\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
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
