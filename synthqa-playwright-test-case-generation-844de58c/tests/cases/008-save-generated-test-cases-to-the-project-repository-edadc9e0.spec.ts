import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["edadc9e0-fb8a-4111-b049-a96116360777"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Save Generated Test Cases to the Project Repository`, () => {
  test(`edadc9e0-fb8a-4111-b049-a96116360777`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Select requirement 'Product Search'`, async () => {
        await page.locator('[data-testid=\'requirement-select\']').selectOption('Product Search');
        await expect(page.locator('[data-testid=\'requirement-select\']')).toHaveValue('Product Search');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Select the Default Template`, async () => {
        await page.locator('[data-testid=\'template-select\']').selectOption('Default Template');
        await expect(page.locator('[data-testid=\'template-select\']')).toHaveValue('Default Template');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click Generate Test Cases`, async () => {
        await page.locator('[data-testid=\'generate-button\']').click();
        await expect(page.locator('[data-testid=\'test-cases-results\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for the results to appear`, async () => {
        await page.locator('[data-testid=\'test-cases-results\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'test-cases-results\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Select the project 'E-Commerce Platform QA' from the save-to project dropdown`, async () => {
        await page.locator('[data-testid=\'project-select\']').selectOption('E-Commerce Platform QA');
        await expect(page.locator('[data-testid=\'project-select\']')).toHaveValue('E-Commerce Platform QA');

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Click the Save Test Cases button`, async () => {
        await page.locator('[data-testid=\'save-test-cases-button\']').click();
        await expect(page.locator('[data-testid=\'success-notification\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 8: Verify the success notification message text`, async () => {
        await page.locator('[data-testid=\'success-notification\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'success-notification\']')).toContainText('Test cases saved successfully');

        await page.screenshot({
          path: testInfo.outputPath(`step-8.png`),
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
