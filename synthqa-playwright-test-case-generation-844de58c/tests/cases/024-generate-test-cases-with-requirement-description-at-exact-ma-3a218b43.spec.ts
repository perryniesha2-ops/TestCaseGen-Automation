import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["3a218b43-bbd4-434b-a9bd-840ca7eee751"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases with Requirement Description at Exact Maximum Allowed Length`, () => {
  test(`3a218b43-bbd4-434b-a9bd-840ca7eee751`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill the requirement description with exactly 500 characters`, async () => {
        await page.locator('[data-testid="requirement-description"]').evaluate((el, val) => { (el as HTMLInputElement).value = val; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, 'a'.repeat(500));
        const fieldValue = await page.locator('[data-testid="requirement-description"]').inputValue();
        expect(fieldValue).toHaveLength(500);

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Verify the character counter shows 500/500`, async () => {
        await page.locator('[data-testid="character-counter"]').click();
        await expect(page.locator('[data-testid="character-counter"]')).toContainText('500/500');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Select a test case template`, async () => {
        await page.locator('[data-testid="template-selector"]').selectOption('Basic Functional');
        await expect(page.locator('[data-testid="template-selector"]')).toHaveValue('Basic Functional');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid="generate-button"]').click();
        await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Wait for the generation result to appear`, async () => {
        await page.locator('[data-testid="generated-test-cases"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="generated-test-cases"]')).toBeVisible();

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
