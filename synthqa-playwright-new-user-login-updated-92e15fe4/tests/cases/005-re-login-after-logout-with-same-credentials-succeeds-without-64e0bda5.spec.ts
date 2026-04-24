import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["64e0bda5-ecdd-429d-b9eb-c30480aa8cb0"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Re-Login After Logout With Same Credentials Succeeds Without Requiring Page Reload`, () => {
  test(`64e0bda5-ecdd-429d-b9eb-c30480aa8cb0`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill email for first login attempt`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'florence.okafor@meridian.org');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('florence.okafor@meridian.org');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill password for first login attempt`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'Junip3r!Lakes77');
        await expect(page.locator('input[type=\'password\']')).toHaveValue('Junip3r!Lakes77');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Submit first login`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();
        await expect(page).toHaveURL(baseUrl + '/dashboard');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for authenticated content to load`, async () => {
        await page.locator('[data-testid=\'user-menu\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        await expect(page.locator('[data-testid=\'user-menu\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Open user menu`, async () => {
        await page.locator('[data-testid=\'user-menu\']').click();
        await expect(page.locator('[data-testid=\'logout-button\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Click Logout to end the session`, async () => {
        await page.locator('[data-testid=\'logout-button\']').click();
        await expect(page).toHaveURL(baseUrl + '/login');

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 8: Confirm the login email input is present and enabled (form reset properly)`, async () => {
        await page.locator('input[name=\'email\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(2000);
        await expect(page.locator('input[name=\'email\']')).toBeEnabled();

        await page.screenshot({
          path: testInfo.outputPath(`step-8.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 9: Confirm email field is empty (no stale value from previous session)`, async () => {
        await page.locator('input[name=\'email\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('input[name=\'email\']')).toHaveValue('');

        await page.screenshot({
          path: testInfo.outputPath(`step-9.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 10: Fill email for second login attempt in the same tab`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'florence.okafor@meridian.org');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('florence.okafor@meridian.org');

        await page.screenshot({
          path: testInfo.outputPath(`step-10.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 11: Fill password for second login attempt`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'Junip3r!Lakes77');
        await expect(page.locator('input[type=\'password\']')).toHaveValue('Junip3r!Lakes77');

        await page.screenshot({
          path: testInfo.outputPath(`step-11.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 12: Submit the second login`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();
        await expect(page).toHaveURL(baseUrl + '/dashboard');

        await page.screenshot({
          path: testInfo.outputPath(`step-12.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 13: Confirm authenticated user identity is correct on second login`, async () => {
        await page.locator('[data-testid=\'user-menu\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        await expect(page.locator('[data-testid=\'user-menu\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-13.png`),
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
