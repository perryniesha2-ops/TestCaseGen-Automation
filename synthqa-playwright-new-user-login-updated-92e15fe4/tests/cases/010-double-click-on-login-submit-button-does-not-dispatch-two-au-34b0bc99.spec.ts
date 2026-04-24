import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["34b0bc99-bf2f-42c9-839a-c8eec14d1b6c"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Double-click on login submit button does not dispatch two authentication requests causing duplicate session creation or account lockout acceleration`, () => {
  test(`34b0bc99-bf2f-42c9-839a-c8eec14d1b6c`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    });


    await test.step(`Step 1: Apply Slow 3G network throttle (400–600ms latency) via browser devtools or test framework network conditions`, async () => {
        await page.locator('body').waitFor({ state: 'visible' });
        await page.waitForTimeout(300);

        await page.screenshot({
          path: testInfo.outputPath(`step-1.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 2: Navigate to the login page`, async () => {
        await page.goto(baseUrl + '/login');
        await expect(page).toHaveURL(baseUrl + '/login');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the email field`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'priya.venkataraman@brightfield.io');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('priya.venkataraman@brightfield.io');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Fill in the password field with the correct password`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'C0rvus!Flight42');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Double-click the submit button rapidly (simulate impatient user)`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Click the submit button a second time immediately after the first (within 200ms)`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Wait for authentication to complete and the success redirect`, async () => {
        await page.locator('[data-testid=\'user-avatar\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(8000);
        await expect(page.locator('[data-testid=\'user-avatar\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 8: Verify only one network request was dispatched to the auth endpoint (check network log count)`, async () => {
        await page.locator('[data-testid=\'user-avatar\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid=\'user-avatar\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-8.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 9: Teardown: Log out to clear the created session`, async () => {
        await page.locator('[data-testid=\'logout-button\']').click();

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
