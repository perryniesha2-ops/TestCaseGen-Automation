import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["a6835aa2-3ceb-414d-9f86-713a386967aa"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Rapid double-submit of login form creates duplicate concurrent authentication requests — race condition producing two sessions`, () => {
  test(`a6835aa2-3ceb-414d-9f86-713a386967aa`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in a valid email address`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'devraj.nair@acmecorp.dev');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('devraj.nair@acmecorp.dev');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the correct password`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'C0nfluence#99');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the submit button a first time`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Immediately click the submit button a second time without waiting for the response`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Wait for the page to settle after both clicks`, async () => {
        await page.locator('[data-testid=\'user-avatar\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(6000);
        await expect(page.locator('[data-testid=\'user-avatar\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Verify the submit button was disabled or showed a loading indicator after the first click to prevent double submission`, async () => {
        await page.locator('[data-testid=\'submit-button\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid=\'submit-button\']')).toBeDisabled();

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
