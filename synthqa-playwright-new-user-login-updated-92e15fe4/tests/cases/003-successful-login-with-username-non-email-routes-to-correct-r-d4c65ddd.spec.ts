import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["d4c65ddd-8f80-44ec-a650-4214b8a888d7"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Successful Login with Username (Non-Email) Routes to Correct Role-Based Dashboard`, () => {
  test(`d4c65ddd-8f80-44ec-a650-4214b8a888d7`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the username field with a plain username (no @ symbol, no domain)`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'ops.supervisor_42');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('ops.supervisor_42');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the password`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'W!nd0wPane#99');
        await expect(page.locator('input[type=\'password\']')).toHaveValue('W!nd0wPane#99');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the Sign In button`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();
        await expect(page).toHaveURL(baseUrl + '/supervisor/dashboard');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify the role indicator in the UI reflects 'Supervisor' — not 'Admin' or 'User'`, async () => {
        await page.locator('[data-testid=\'role-badge\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        await expect(page.locator('[data-testid=\'role-badge\']')).toContainText('Supervisor');

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Confirm the username is displayed correctly in the user profile area`, async () => {
        await page.locator('[data-testid=\'user-menu\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(1000);
        await expect(page.locator('[data-testid=\'user-menu\']')).toContainText('ops.supervisor_42');

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
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
