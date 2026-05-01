import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["2af97583-c196-430f-b41f-4eb8a2f96743"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Enter Excessively Long Text in Test Case Title Description Field`, () => {
  test(`2af97583-c196-430f-b41f-4eb8a2f96743`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill the title/description override field with a 2001-character string`, async () => {
        await page.locator('[data-testid="description-override-field"]').evaluate((el, val) => { (el as HTMLInputElement).value = val; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, 'a'.repeat(2001));
        const fieldValue = await page.locator('[data-testid="description-override-field"]').inputValue();
        expect(fieldValue).toHaveLength(2001);

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid="generate-button"]').click();
        await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Verify the character limit error message`, async () => {
        await page.locator('[data-testid="error-message"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="error-message"]')).toContainText('Description must not exceed 2000 characters');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Confirm the character counter turns red or shows an exceeded state`, async () => {
        await page.locator('[data-testid="character-counter"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="character-counter"]')).toHaveAttribute('class', 'error');

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
