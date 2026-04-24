import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["48b73ca9-053b-4e6f-b174-73be7b4e3bfb"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login field autofilled with stale browser-cached credentials then silently overwritten — stale session submitted`, () => {
  test(`48b73ca9-053b-4e6f-b174-73be7b4e3bfb`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Click into the email field to trigger browser autofill for AccountA`, async () => {
        await page.locator('input[name=\'email\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Clear the email field and type the intended (AccountB) email address — do NOT touch the password field`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'margaret.chen@newcompany.io');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('margaret.chen@newcompany.io');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Submit the form without modifying the autofilled password`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify the application returns an authentication failure rather than unexpectedly authenticating`, async () => {
        await page.locator('[data-testid=\'login-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await expect(page.locator('[data-testid=\'login-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Verify the URL has not changed to an authenticated route`, async () => {
        await page.locator('body').waitFor({ state: 'visible' });
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(baseUrl + '/login');

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
