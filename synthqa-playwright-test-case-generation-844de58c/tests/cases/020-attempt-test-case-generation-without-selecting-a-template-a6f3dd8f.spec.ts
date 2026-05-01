import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["a6f3dd8f-673e-4daf-94c8-2528caffef7b"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Attempt Test Case Generation Without Selecting a Template`, () => {
  test(`a6f3dd8f-673e-4daf-94c8-2528caffef7b`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Check the first available requirement checkbox`, async () => {
        await page.locator('[data-testid="requirement-checkbox"]:first-of-type').check();
        await expect(page.locator('[data-testid="requirement-checkbox"]:first-of-type')).toBeChecked();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Leave the template selector empty and click Generate Test Cases`, async () => {
        await page.locator('button[type="submit"], [data-testid="generate-button"]').click();
        await expect(page.locator('[data-testid="template-error"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Verify the template error message text`, async () => {
        await page.locator('[data-testid="template-error"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="template-error"]')).toContainText('Please select a template');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Confirm no requirement error is shown`, async () => {
        await page.locator('[data-testid="requirement-error"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="requirement-error"]')).toBeHidden();

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
