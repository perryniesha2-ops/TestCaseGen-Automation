import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["a5fe2f6b-9a4b-4a92-b001-360d78ecec90"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login Form Fields Display Correct Labels and Placeholder Text`, () => {
  test(`a5fe2f6b-9a4b-4a92-b001-360d78ecec90`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Verify the email or username input field is visible`, async () => {
      await page.getByTestId("login-email-input").waitFor({ state: "visible" });
      await page.waitForTimeout(2000);
      await expect(page.getByTestId("login-email-input")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Verify the password input field is visible`, async () => {
      await page
        .getByTestId("login-password-input")
        .waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      await expect(page.getByTestId("login-password-input")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Verify the submit (Login) button is visible and enabled`, async () => {
      await page
        .getByTestId("login-submit-button")
        .waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      await expect(page.getByTestId("login-submit-button")).toBeEnabled();

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the 'Forgot Password' link is visible on the login page`, async () => {
      await page
        .locator("[data-testid='forgot-password-link']")
        .waitFor({ state: "visible" });
      await page.waitForTimeout(1000);
      await expect(
        page.locator("[data-testid='forgot-password-link']"),
      ).toBeVisible();

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
