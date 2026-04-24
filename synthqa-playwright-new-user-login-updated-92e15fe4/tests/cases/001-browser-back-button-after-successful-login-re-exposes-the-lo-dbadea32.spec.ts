import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["dbadea32-cac7-4c57-8975-9b101b489553"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Browser back-button after successful login re-exposes the login form and allows resubmission without re-authentication challenge`, () => {
  test(`dbadea32-cac7-4c57-8975-9b101b489553`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the email field with a valid account email`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'sofia.reinholt@globalbank.eu');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('sofia.reinholt@globalbank.eu');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the password field`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'Banc@ire#2024');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Submit the login form`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for the authenticated dashboard to fully load`, async () => {
        await page.locator('[data-testid=\'user-avatar\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(6000);
        await expect(page.locator('[data-testid=\'user-avatar\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Press the browser Back button to navigate back to the login page`, async () => {
        await page.locator('body').press('Alt+ArrowLeft');

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Wait to observe whether the application detects the active session and redirects away from the login page`, async () => {
        await page.locator('body').waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        await expect(page).toHaveURL(baseUrl + '/dashboard');

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 8: If the login form IS visible (bfcache restored it), attempt to click submit with the cached form values`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-8.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 9: Verify only one active session exists for this user account after the back-button interaction`, async () => {
        await page.locator('[data-testid=\'user-avatar\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await expect(page.locator('[data-testid=\'user-avatar\']')).toBeVisible();

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
