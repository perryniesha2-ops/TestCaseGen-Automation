import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["884ce9c9-d449-4a43-b929-e8b6fe393ed5"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Export Generated Test Cases to CSV Format Successfully`, () => {
  test(`884ce9c9-d449-4a43-b929-e8b6fe393ed5`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");


    await test.step(`Step 1: Navigate to the test case generator page with pre-generated results`, async () => {
        await page.goto(baseUrl + '/generate');
        await expect(page).toHaveURL(baseUrl + '/generate');

        await page.screenshot({
          path: testInfo.outputPath(`step-1.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 2: Select requirement 'Shopping Cart Checkout'`, async () => {
        await page.locator('[data-testid=\'requirement-shopping-cart-checkout\']').click();
        await expect(page.locator('[data-testid=\'requirement-shopping-cart-checkout\']')).toBeChecked();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Select the Default Template`, async () => {
        await page.locator('[data-testid=\'template-default\']').click();
        await expect(page.locator('[data-testid=\'template-default\']')).toBeChecked();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click Generate Test Cases`, async () => {
        await page.locator('[data-testid=\'generate-button\']').click();
        await expect(page.locator('[data-testid=\'generation-progress\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for test cases to appear in the results panel`, async () => {
        await page.locator('[data-testid=\'test-cases-results\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'test-cases-results\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Click the Export to CSV button`, async () => {
        await page.locator('[data-testid=\'export-csv-button\']').click();
        await expect(page.locator('[data-testid=\'download-progress\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Verify the export success message is displayed`, async () => {
        await page.locator('[data-testid=\'export-success-message\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'export-success-message\']')).toBeVisible();

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
