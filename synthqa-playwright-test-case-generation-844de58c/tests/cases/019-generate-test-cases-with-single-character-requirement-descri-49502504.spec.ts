import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["49502504-5a30-435e-9830-617a5396e0e9"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases with Single-Character Requirement Description (Min String Length)`, () => {
  test(`49502504-5a30-435e-9830-617a5396e0e9`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Click on the requirement description input field`, async () => {
        await page.locator('[data-testid="requirement-description-input"]').click();
        await expect(page.locator('[data-testid="requirement-description-input"]')).toHaveAttribute('focused', 'true');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Type a single character into the requirement description field`, async () => {
        await page.locator('[data-testid="requirement-description-input"]').fill('A');
        await expect(page.locator('[data-testid="requirement-description-input"]')).toHaveValue('A');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Select a test case template from the dropdown`, async () => {
        await page.locator('[data-testid="template-dropdown"]').selectOption('Functional Test Template');
        await expect(page.locator('[data-testid="template-dropdown"]')).toHaveValue('Functional Test Template');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid="generate-button"]').click();
        await expect(page.locator('[data-testid="test-cases-output"],[data-testid="validation-message"]')).toBeVisible();

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
