import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["f99c62d9-175f-438a-bd19-16fc5ceed9ea"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Successful Login with Email and Password Redirects to Dashboard`, () => {
  test(`f99c62d9-175f-438a-bd19-16fc5ceed9ea`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Verify the email field label is visible`, async () => {
      await expect(page.getByTestId("login-form")).toBeVisible();
      await expect(page.getByTestId("login-email-input")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Enter valid email address into the email field`, async () => {
      await page
        .getByTestId("login-email-input")
        .fill(process.env.TEST_USER_EMAIL || "jane.doe@acme.com");
      await expect(page.getByTestId("login-email-input")).toHaveValue(
        process.env.TEST_USER_EMAIL || "jane.doe@acme.com",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Enter valid password into the password field`, async () => {
      await page
        .getByTestId("login-password-input")
        .fill(process.env.TEST_USER_PASSWORD || "SecurePass123!");
      await expect(page.getByTestId("login-password-input")).toHaveAttribute(
        "type",
        "password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Click the Sign In button`, async () => {
      await page.getByTestId("login-submit-button").click();
      await expect(page.getByTestId("login-submit-button")).toBeDisabled();

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Wait for redirect to the dashboard after successful authentication`, async () => {
      await expect(page.getByTestId("dashboard")).toBeVisible();
      await expect(page).toHaveURL(baseUrl + "/dashboard");

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Verify dashboard content is loaded`, async () => {
      await expect(page.getByTestId("metrics-cards")).toBeVisible();
      await expect(page.getByTestId("quick-actions")).toBeVisible();

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
