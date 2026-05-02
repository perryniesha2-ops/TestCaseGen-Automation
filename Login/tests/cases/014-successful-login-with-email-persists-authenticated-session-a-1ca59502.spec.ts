import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["1ca59502-c5ca-4852-bd2c-3c9fa3474449"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Successful Login with Email Persists Authenticated Session Across Page Refresh`, () => {
  test(`1ca59502-c5ca-4852-bd2c-3c9fa3474449`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the email address field`, async () => {
      await page
        .getByTestId("login-email-input")
        .fill(process.env.TEST_USER_EMAIL || "jane.doe@acme.com");
      await expect(page.getByTestId("login-email-input")).toHaveValue(
        process.env.TEST_USER_EMAIL || "jane.doe@acme.com",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill in the password field`, async () => {
      await page
        .getByTestId("login-password-input")
        .fill(process.env.TEST_USER_PASSWORD || "SecurePass123!");
      await expect(page.getByTestId("login-password-input")).toHaveAttribute(
        "type",
        "password",
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Click the Sign In / Submit button`, async () => {
      await page.getByTestId("login-submit-button").click();
      await expect(page).toHaveURL(baseUrl + "/dashboard", { timeout: 15000 });

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the authenticated user's name or avatar is visible`, async () => {
      await page.getByLabel("Account menu").waitFor({ state: "visible" });
      await page.waitForLoadState("networkidle");
      await expect(page.getByLabel("Account menu")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Perform a hard page reload to test session persistence`, async () => {
      await page.reload({ waitUntil: "networkidle" });
      await expect(page).toHaveURL(baseUrl + "/dashboard", { timeout: 15000 });

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Confirm user menu still visible after reload`, async () => {
      await page.getByLabel("Account menu").waitFor({ state: "visible" });
      await page.waitForLoadState("networkidle");
      await expect(page.getByLabel("Account menu")).toBeVisible();

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
