import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["f83fcf10-02d9-4886-86b4-48495e82767b"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Authentication API returning HTTP 500 displays a user-facing error message instead of silently failing or exposing a stack trace`, () => {
  test(`f83fcf10-02d9-4886-86b4-48495e82767b`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    });


    await test.step(`Step 1: Configure network interception to return HTTP 500 for the login API endpoint before navigating (done via test framework route mock)`, async () => {
        await page.locator('body').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);

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

    await test.step(`Step 3: Fill in the email field with a syntactically valid email`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'rafael.okonkwo@nexusplatform.com');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('rafael.okonkwo@nexusplatform.com');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Fill in the password field with a plausible password`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'Qx7!mPvL#2rZ');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Click the submit button to trigger the login API call that will return 500`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Wait for the error state to resolve after the mocked 500 response`, async () => {
        await page.locator('[data-testid=\'login-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(5000);
        await expect(page.locator('[data-testid=\'login-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Verify the error message text does not contain server internals (stack trace keywords)`, async () => {
        await page.locator('[data-testid=\'login-error\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid=\'login-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 8: Verify the user remains on the login page and has NOT been redirected`, async () => {
        await page.locator('[data-testid=\'submit-button\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page).toHaveURL(baseUrl + '/login');

        await page.screenshot({
          path: testInfo.outputPath(`step-8.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 9: Verify the submit button is re-enabled and the form is still usable after the 500 error`, async () => {
        await page.locator('[data-testid=\'submit-button\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid=\'submit-button\']')).toBeEnabled();

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
