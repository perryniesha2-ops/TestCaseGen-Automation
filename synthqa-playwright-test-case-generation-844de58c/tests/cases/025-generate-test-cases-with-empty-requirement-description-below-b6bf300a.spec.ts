import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["b6bf300a-dcd8-4e68-8a11-583476ede9db"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases with Empty Requirement Description (Below Minimum String Length)`, () => {
  test(`b6bf300a-dcd8-4e68-8a11-583476ede9db`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Ensure the requirement description input is empty (clear any pre-filled content)`, async () => {
        await page.locator('[data-testid="requirement-description"]').fill('');
        await expect(page.locator('[data-testid="requirement-description"]')).toHaveValue('');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Select a test case template from the dropdown`, async () => {
        await page.locator('[data-testid="template-dropdown"]').selectOption('Functional Test Template');
        await expect(page.locator('[data-testid="template-dropdown"]')).toHaveValue('Functional Test Template');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid="generate-button"]').click();
        await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify the validation error message text`, async () => {
        await page.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="validation-error"]')).toContainText('Requirement description is required');

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
