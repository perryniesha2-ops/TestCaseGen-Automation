import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["b3e62225-e10b-4e0a-9ce5-7a10e35bc7d3"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`User Selects Multiple Requirements and Generates a Combined Test Case Set`, () => {
  test(`b3e62225-e10b-4e0a-9ce5-7a10e35bc7d3`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");


    await test.step(`Step 1: Navigate to the test case generator page`, async () => {
        await page.goto(baseUrl + '/generate');
        await expect(page).toHaveURL(baseUrl + '/generate');

        await page.screenshot({
          path: testInfo.outputPath(`step-1.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 2: Check the requirement checkbox for 'User Registration'`, async () => {
        await page.locator('[data-testid=\'requirement-checkbox-user-registration\']').check();
        await expect(page.locator('[data-testid=\'requirement-checkbox-user-registration\']')).toBeChecked();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Check the requirement checkbox for 'Email Verification'`, async () => {
        await page.locator('[data-testid=\'requirement-checkbox-email-verification\']').check();
        await expect(page.locator('[data-testid=\'requirement-checkbox-email-verification\']')).toBeChecked();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Select the 'Standard' template`, async () => {
        await page.locator('[data-testid=\'template-selector\']').selectOption('Standard');
        await expect(page.locator('[data-testid=\'template-selector\']')).toHaveValue('Standard');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid=\'generate-button\']').click();
        await expect(page.locator('[data-testid=\'loading-spinner\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Wait for the results panel to appear`, async () => {
        await page.locator('[data-testid=\'results-panel\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'results-panel\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Verify that generated test cases reference both selected requirements`, async () => {
        await page.locator('[data-testid=\'test-case-tags\']').hover();
        await expect(page.locator('[data-testid=\'test-case-tags\']')).toContainText('User Registration, Email Verification');

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
