import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["a1ad53e9-a567-4e9f-9344-1ab87b5d5e9d"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases with Empty Requirements Selection (Zero Items in Collection)`, () => {
  test(`a1ad53e9-a567-4e9f-9344-1ab87b5d5e9d`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");


    await test.step(`Step 1: Navigate to the test case generation page`, async () => {
        await page.goto(baseUrl + '/generate');
        await expect(page).toHaveURL(baseUrl + '/generate');

        await page.screenshot({
          path: testInfo.outputPath(`step-1.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 2: Verify no requirements are pre-selected in the requirements list`, async () => {
        await page.locator('[data-testid=\'requirements-list\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'requirements-list\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Ensure any pre-checked requirements are unchecked`, async () => {
        await page.locator('[data-testid=\'requirement-checkbox\']:checked').uncheck();
        await expect(page.locator('[data-testid=\'requirement-checkbox\']:checked')).toHaveCount(0);

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Select a test case template`, async () => {
        await page.locator('[data-testid=\'template-selector\']').selectOption('Regression Test Template');
        await expect(page.locator('[data-testid=\'template-selector\']')).toHaveValue('Regression Test Template');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid=\'generate-button\']').click();
        await expect(page.locator('[data-testid=\'validation-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Verify the validation error message for empty selection`, async () => {
        await page.locator('[data-testid=\'validation-error\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'validation-error\']')).toContainText('Please select at least one requirement');

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
