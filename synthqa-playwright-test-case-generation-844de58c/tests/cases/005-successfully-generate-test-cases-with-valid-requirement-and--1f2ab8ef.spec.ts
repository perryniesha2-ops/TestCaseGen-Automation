import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["1f2ab8ef-efd5-476f-a7dd-9ca5ee74ee61"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Successfully Generate Test Cases With Valid Requirement and Default Template`, () => {
  test(`1f2ab8ef-efd5-476f-a7dd-9ca5ee74ee61`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Select a requirement from the requirements dropdown`, async () => {
        await page.locator('[data-testid="requirement-dropdown"]').selectOption('User Authentication Flow');
        await expect(page.locator('[data-testid="requirement-dropdown"]')).toHaveValue('User Authentication Flow');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Select the default template from the template dropdown`, async () => {
        await page.locator('[data-testid="template-dropdown"]').selectOption('Default Template');
        await expect(page.locator('[data-testid="template-dropdown"]')).toHaveValue('Default Template');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid="generate-button"]').click();
        await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for the test case results to appear`, async () => {
        await page.locator('[data-testid="test-results-panel"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="test-results-panel"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Verify the generated test cases list is populated`, async () => {
        await page.locator('[data-testid="test-cases-list"]').hover();
        await expect(page.locator('[data-testid="test-case-item"]')).toHaveCount(1);

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
