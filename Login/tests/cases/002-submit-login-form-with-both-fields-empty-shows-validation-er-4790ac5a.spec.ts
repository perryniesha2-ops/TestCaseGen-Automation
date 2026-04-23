import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["4790ac5a-5c02-4c5b-b99a-f153eababe46"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Submit Login Form With Both Fields Empty Shows Validation Errors`, () => {
  test(`4790ac5a-5c02-4c5b-b99a-f153eababe46`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step(`Step 1: Navigate to the login page`, async () => {
      await page.goto(baseUrl + "/login");
      await expect(page).toHaveURL(baseUrl + "/login");

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Click the submit/login button without entering any credentials`, async () => {
      await page.getByTestId("login-submit-button").click();
      await expect(page).toHaveURL(baseUrl + "/login");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Verify the email/username field shows a required validation error`, async () => {
      const validationMessage = await page
        .getByTestId("login-email-input")
        .evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toContain("Please fill out this field");

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
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
