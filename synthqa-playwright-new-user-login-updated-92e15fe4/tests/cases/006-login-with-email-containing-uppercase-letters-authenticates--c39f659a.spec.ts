import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth = testConfig["c39f659a-09e5-497d-a297-cbc1bedbb637"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login with Email Containing Uppercase Letters Authenticates Successfully (Case-Insensitive Email Matching)`, () => {
  test(`c39f659a-09e5-497d-a297-cbc1bedbb637`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the email using mixed-case — different casing from what is stored in the database`, async () => {
        await page.locator('input[name=\'email\']').fill(process.env.TEST_USER_EMAIL || 'PETRA.Vondrak@CloudBase.EU');
        await expect(page.locator('input[name=\'email\']')).toHaveValue('PETRA.Vondrak@CloudBase.EU');

        await page.screenshot({
          path: testInfo.outputPath(`step-2.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 3: Fill in the correct password for this account`, async () => {
        await page.locator('input[type=\'password\']').fill(process.env.TEST_USER_PASSWORD || 'M4gn0lia*Frost');
        await expect(page.locator('input[type=\'password\']')).toHaveValue('M4gn0lia*Frost');

        await page.screenshot({
          path: testInfo.outputPath(`step-3.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 4: Submit the login form`, async () => {
        await page.locator('[data-testid=\'submit-button\']').click();
        await expect(page).toHaveURL(baseUrl + '/dashboard');

        await page.screenshot({
          path: testInfo.outputPath(`step-4.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 5: Wait for the authenticated dashboard to render`, async () => {
        await page.locator('[data-testid=\'user-menu\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(3000);
        await expect(page.locator('[data-testid=\'user-menu\']')).toBeVisible();

        await page.screenshot({
          path: testInfo.outputPath(`step-5.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 6: Verify the displayed email in the user profile/account settings matches the canonical lowercase version, not the uppercased input`, async () => {
        await page.goto(baseUrl + '/account/profile');
        await expect(page).toHaveURL(baseUrl + '/account/profile');

        await page.screenshot({
          path: testInfo.outputPath(`step-6.png`),
          fullPage: true,
        });
    });

    await test.step(`Step 7: Confirm the email shown in the profile is the normalized lowercase form`, async () => {
        await page.locator('[data-testid=\'profile-email\']').waitFor({ state: 'visible' });
        await page.waitForTimeout(2000);
        await expect(page.locator('[data-testid=\'profile-email\']')).toContainText('petra.vondrak@cloudbase.eu');

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
