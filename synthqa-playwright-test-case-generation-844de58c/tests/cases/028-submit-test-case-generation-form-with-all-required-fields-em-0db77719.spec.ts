import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["0db77719-abdb-4dd8-bf0c-04fd2b2be4e6"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Submit Test Case Generation Form With All Required Fields Empty`, () => {
  test(`0db77719-abdb-4dd8-bf0c-04fd2b2be4e6`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Click the Generate Test Cases button without filling any fields`, async () => {
        await page.locator('[data-testid="generate-button"]').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Verify the requirement field error message is shown`, async () => {
        await page.locator('[data-testid="requirement-error"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="requirement-error"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Verify the template field error message is shown`, async () => {
        await page.locator('[data-testid="template-error"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="template-error"]')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Verify no test cases are generated (results panel remains empty)`, async () => {
        await page.locator('[data-testid="results-panel"]').waitFor({ state: 'visible' });
        await expect(page.locator('[data-testid="results-panel"]')).toBeHidden();

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
