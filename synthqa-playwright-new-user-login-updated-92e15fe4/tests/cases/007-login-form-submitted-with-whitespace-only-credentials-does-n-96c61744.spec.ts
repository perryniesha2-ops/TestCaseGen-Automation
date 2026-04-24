import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["96c61744-556b-4354-bc9d-ffb32c00e7bf"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login form submitted with whitespace-only credentials does not authenticate and shows field-level validation errors`, () => {
  test(`96c61744-556b-4354-bc9d-ffb32c00e7bf`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill email/username field with whitespace-only content (three spaces)`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || '   ');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('   ');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill password field with whitespace-only content (two tabs)`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || '		');
        await expect(page.locator('input[type=\'password\']')).toHaveValue('		');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the submit / Sign In button`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify email/username validation error message is visible`, async () => {
        await page.locator('[data-testid=\'email-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(1000);
        await expect(page.locator('[data-testid=\'email-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Verify password validation error message is visible`, async () => {
        await page.locator('[data-testid=\'password-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid=\'password-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Verify the user has NOT been redirected away from the login page`, async () => {
        await page.locator('[data-testid=\'submit-button\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page).toHaveURL(baseUrl + '/login');

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
