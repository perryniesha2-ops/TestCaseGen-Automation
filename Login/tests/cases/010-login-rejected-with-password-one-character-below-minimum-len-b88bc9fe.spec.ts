import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["b88bc9fe-ed0f-48d7-86d1-1d779e155f43"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login rejected with password one character below minimum length (6 characters)`, () => {
  test(`b88bc9fe-ed0f-48d7-86d1-1d779e155f43`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill the username field with a plausible username`, async () => {
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

    await test.step(`Step 3: Fill the password field with a 7-character password (one below minimum)`, async () => {
      await page.getByTestId("login-password-input").fill("Secur");
      await expect(page.getByTestId("login-password-input")).toHaveAttribute(
        "type",
        "password",
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Click the login submit button`, async () => {
      await page.getByTestId("login-submit-button").click();
      const validationMessage = await page
        .getByTestId("login-password-input")
        .evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toContain(
        "Please lengthen this text to 6 characters",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
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
