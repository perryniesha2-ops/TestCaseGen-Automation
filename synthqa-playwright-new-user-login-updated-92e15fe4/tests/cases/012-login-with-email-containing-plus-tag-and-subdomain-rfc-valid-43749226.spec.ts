import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["43749226-b136-4635-b65e-64c98d6d00f3"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login with email containing plus-tag and subdomain (RFC-valid but often rejected by naive validators)`, () => {
  test(`43749226-b136-4635-b65e-64c98d6d00f3`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the email field with a valid RFC 5321 plus-tag address on a multi-level subdomain`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'qa.lead+smoke_2024@mail.staging.acme.co.uk');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('qa.lead+smoke_2024@mail.staging.acme.co.uk');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the password field`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'Tr0ub4dor&3');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Submit the login form`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();
        await expect(page.locator('[data-testid=\'email-error\']')).toBeHidden();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify successful authentication and redirect to the authenticated landing page`, async () => {
        await page.locator('[data-testid=\'user-avatar\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(5000);
        await expect(page.locator('[data-testid=\'user-avatar\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
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
