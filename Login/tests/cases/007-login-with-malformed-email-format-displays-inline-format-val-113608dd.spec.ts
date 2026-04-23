import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["113608dd-45fe-4d95-9bfd-7ba03b3b70c7"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login With Malformed Email Format Displays Inline Format Validation Error`, () => {
  test(`113608dd-45fe-4d95-9bfd-7ba03b3b70c7`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill the email field with a malformed email address`, async () => {
      await page.getByTestId("login-email-input").fill("not-an-email-address");
      await page.getByTestId("login-submit-button").click();

      // Assert the input is invalid via the browser's constraint validation API
      const isInvalid = await page
        .getByTestId("login-email-input")
        .evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBe(true);

      // Optionally assert the specific validation message text
      const validationMessage = await page
        .getByTestId("login-email-input")
        .evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toContain("@");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill the password field with a plausible password`, async () => {
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

    await test.step(`Step 4: Click the submit button`, async () => {
      await page.getByTestId("login-submit-button").click();

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the user remains on the login page`, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await expect(page).toHaveURL(baseUrl + "/login");

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
