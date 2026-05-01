import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["1f05514c-2fbd-4607-b081-37a258425a7c"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Attempt Test Case Generation Without Selecting a Requirement`, () => {
  test(`1f05514c-2fbd-4607-b081-37a258425a7c`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Select a template from the template dropdown`, async () => {
        await page.locator('[data-testid="template-selector"]').selectOption('Standard Functional Template');
        await expect(page.locator('[data-testid="template-selector"]')).toHaveValue('Standard Functional Template');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Leave the requirement selector empty and click Generate Test Cases`, async () => {
        await page.locator('[data-testid="generate-button"]').click();
        await expect(page.locator('[data-testid="requirement-error"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Verify error message content for the requirement field`, async () => {
        await page.locator('[data-testid="requirement-error"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="requirement-error"]')).toContainText('Please select at least one requirement');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Confirm no template error is shown (template was correctly provided)`, async () => {
        await page.locator('[data-testid="template-error"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="template-error"]')).toBeHidden();

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
