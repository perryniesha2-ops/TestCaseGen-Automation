import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["4a0b90f4-a87e-43a4-8e66-75a6142ba3f3"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases with Requirement Description One Character Over Maximum Length`, () => {
  test(`4a0b90f4-a87e-43a4-8e66-75a6142ba3f3`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill the requirement description with 501 characters (one over the maximum limit)`, async () => {
        await page.locator('[data-testid=\'requirement-description\']').evaluate((el, val) => { (el as HTMLInputElement).value = val; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, 'a'.repeat(501));
        const fieldValue = await page.locator('[data-testid=\'requirement-description\']').inputValue();
        expect(fieldValue).toHaveLength(501);

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid=\'generate-button\']').click();
        await expect(page.locator('[data-testid=\'validation-error\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Verify the error or truncation message is displayed`, async () => {
        await page.locator('[data-testid=\'validation-error\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'validation-error\']')).toContainText('Description cannot exceed 500 characters');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
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
