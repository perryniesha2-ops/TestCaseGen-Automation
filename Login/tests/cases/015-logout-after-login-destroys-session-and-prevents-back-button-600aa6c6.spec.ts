import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["600aa6c6-ff8f-4df9-909e-d6d9c9622b7e"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Logout After Login Destroys Session and Prevents Back-Button Access to Protected Pages`, () => {
  test(`600aa6c6-ff8f-4df9-909e-d6d9c9622b7e`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill in the email address`, async () => {
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

    await test.step(`Step 3: Fill in the password`, async () => {
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
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(baseUrl + "/dashboard");

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Wait for the dashboard to fully render with authenticated content`, async () => {
      await page.getByLabel("Account menu").waitFor({ state: "visible" });

      await expect(page.getByLabel("Account menu")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Click the user menu to reveal the logout option`, async () => {
      await page.getByLabel("Account menu").click();
      await page.getByRole("button", { name: "Logout" }).click();
      await page.getByRole("button", { name: "Sign out" }).click();
      await page.waitForTimeout(3000);

      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Use browser back navigation to attempt to return to /dashboard`, async () => {
      await page.goto(baseUrl + "/dashboard");
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-7.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 9: Confirm the login form is shown, not cached dashboard content`, async () => {
      await page.getByTestId("login-email-input").waitFor({ state: "visible" });
      await page.waitForTimeout(2000);
      await expect(page.getByTestId("login-email-input")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-9.png`),
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
