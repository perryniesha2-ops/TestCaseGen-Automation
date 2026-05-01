import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["375069d5-64b2-454b-a808-dd563f932d2c"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Attempt Test Case Generation as a Read-Only User Without Generate Permission`, () => {
  test(`375069d5-64b2-454b-a808-dd563f932d2c`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");


    await test.step(`Step 1: Navigate to the test case generation page as the viewer user`, async () => {
        await page.goto(baseUrl + '/generate');
        await expect(page).toHaveURL(baseUrl + '/generate');

        await page.screenshot({
          path: testInfo.outputPath(`step-1.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 2: Verify the Generate Test Cases button is disabled for the read-only user`, async () => {
        await page.locator('[data-testid=\'generate-button\']').click();
        await expect(page.locator('[data-testid=\'generate-button\']')).toBeDisabled();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Hover over the disabled Generate button to check tooltip message`, async () => {
        await page.locator('[data-testid=\'generate-button\']').hover();
        await expect(page.locator('[data-testid=\'permission-tooltip\'], .tooltip, [role=\'tooltip\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Verify the tooltip or permission message content`, async () => {
        await page.locator('[data-testid=\'permission-tooltip\'], .tooltip, [role=\'tooltip\']').click();
        await expect(page.locator('[data-testid=\'permission-tooltip\'], .tooltip, [role=\'tooltip\']')).toContainText('You do not have permission to generate test cases');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Attempt to directly POST to the generation API endpoint (simulate via UI if available) and verify rejection`, async () => {
        await page.goto(baseUrl + '/api/generate');
        await expect(page.locator('body')).toContainText('Access denied');

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
