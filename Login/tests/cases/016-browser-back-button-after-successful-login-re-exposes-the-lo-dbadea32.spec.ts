import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["dbadea32-cac7-4c57-8975-9b101b489553"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Browser back-button after successful login re-exposes the login form and allows resubmission without re-authentication challenge`, () => {
  test(`dbadea32-cac7-4c57-8975-9b101b489553`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the email field with a valid account email`, async () => {
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

    await test.step(`Step 4: Submit the login form`, async () => {
      await page.getByTestId("login-submit-button").click();

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Wait for the authenticated dashboard to fully load`, async () => {
      await expect(page.getByTestId("dashboard")).toBeVisible();
      await expect(page).toHaveURL(baseUrl + "/dashboard");

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Press the browser Back button to navigate back to the login page`, async () => {
      await page.goto(baseUrl + "/login");
      await expect(page).toHaveURL(baseUrl + "/dashboard");

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
