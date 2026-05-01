import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["c46a7f41-faed-4a90-9fb9-622e3ec7d89a"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases Using a Custom Template and Verify Structured Output Format`, () => {
  test(`c46a7f41-faed-4a90-9fb9-622e3ec7d89a`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Select the requirement 'Password Reset Workflow'`, async () => {
        await page.locator('[data-testid=\'requirement-password-reset-workflow\']').click();
        await expect(page.locator('[data-testid=\'requirement-password-reset-workflow\']')).toHaveAttribute('aria-selected', 'true');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Select the 'BDD Gherkin' custom template`, async () => {
        await page.locator('[data-testid=\'template-bdd-gherkin\']').click();
        await expect(page.locator('[data-testid=\'template-bdd-gherkin\']')).toHaveAttribute('aria-selected', 'true');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Click the Generate Test Cases button`, async () => {
        await page.locator('[data-testid=\'generate-test-cases-button\']').click();
        await expect(page.locator('[data-testid=\'loading-spinner\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for results to load`, async () => {
        await page.locator('[data-testid=\'results-panel\']').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid=\'results-panel\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Verify the test cases include Gherkin-style Given/When/Then keywords`, async () => {
        await page.locator('[data-testid=\'generated-test-cases\']').hover();
        await expect(page.locator('[data-testid=\'generated-test-cases\']')).toContainText('Given');

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
