import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["924cbb5a-2662-40e3-89e4-a7ab752b5c47"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login field content pasted from clipboard bypasses format validation and is correctly rejected when pasted value is malformed`, () => {
  test(`924cbb5a-2662-40e3-89e4-a7ab752b5c47`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Click on the email/username field to focus it`, async () => {
        await page.locator('input[name=\'email\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Paste a malformed email string (no domain, leading space) into the email field using keyboard shortcut`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || ' marcus.thibodeau@');
        await expect(page.locator('input[name=\'email\']')).toHaveValue(' marcus.thibodeau@');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Press Tab to move focus away from the email field, triggering blur/change validation`, async () => {
        await page.locator('input[name=\'email\']').press('Tab');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify that an email format validation error appears after blur`, async () => {
        await page.locator('[data-testid=\'email-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(1000);
        await expect(page.locator('[data-testid=\'email-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Fill in the password field with a non-empty password to avoid a second validation error masking the email error`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'Fx9#LmQrT!28v');

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Click the submit button to attempt form submission with the pasted malformed email`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 8: Verify email error message remains visible after attempted submission`, async () => {
        await page.locator('[data-testid=\'email-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(1000);
        await expect(page.locator('[data-testid=\'email-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-8.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 9: Verify the page URL has not changed (user was not redirected or shown a server error)`, async () => {
        await page.locator('input[name=\'email\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page).toHaveURL(baseUrl + '/login');

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
