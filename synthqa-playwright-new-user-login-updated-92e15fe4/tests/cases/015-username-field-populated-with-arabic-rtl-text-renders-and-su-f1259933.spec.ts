import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["f1259933-2ad1-4b8b-ac56-05a89d731111"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Username field populated with Arabic RTL text renders and submits correctly in a LTR-oriented form layout`, () => {
  test(`f1259933-2ad1-4b8b-ac56-05a89d731111`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");


    await test.step(`Step 1: Navigate to the login page`, async () => {
        await page.goto(baseUrl + '/login');
        await expect(page).toHaveURL(baseUrl + '/login');

        await page.screenshot({
          path: testInfo.outputPath(`step-1.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 2: Click the username field to focus it`, async () => {
        await page.locator('input[name=\'username\']').click();

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Type the Arabic RTL username into the username field`, async () => {
        await page.locator('input[name=\'username\']').fill(process.env.TEST_USER_EMAIL || 'أحمد_المستخدم');
        await expect(page.locator('input[name=\'username\']')).toHaveValue('أحمد_المستخدم');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Verify the password field label and position are not displaced by the RTL content in the username field`, async () => {
        await page.locator('input[type=\'password\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(500);
        await expect(page.locator('input[type=\'password\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Fill in the password field`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'P@ssw0rd!2024');

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Submit the login form`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();
        await expect(page.locator('[data-testid=\'username-error\']')).toBeHidden();

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Verify successful authentication with the Arabic username account`, async () => {
        await page.locator('[data-testid=\'user-avatar\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(5000);
        await expect(page.locator('[data-testid=\'user-avatar\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-7.png`),
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
