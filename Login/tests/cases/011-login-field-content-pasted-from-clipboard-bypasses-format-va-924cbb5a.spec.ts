import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["924cbb5a-2662-40e3-89e4-a7ab752b5c47"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login field content pasted from clipboard bypasses format validation and is correctly rejected when pasted value is malformed`, () => {
  test(`924cbb5a-2662-40e3-89e4-a7ab752b5c47`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Click on the email/username field to focus it`, async () => {
      await page.getByTestId("login-email-input").click();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Paste a malformed email string (no domain, leading space) into the email field using keyboard shortcut`, async () => {
      await page.getByTestId("login-email-input").fill("marcus.thibodeau@");
      await expect(page.getByTestId("login-email-input")).toHaveValue(
        "marcus.thibodeau@",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Press Tab to move focus away from the email field, triggering blur/change validation`, async () => {
      await page.getByTestId("login-email-input").press("Tab");

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Fill in the password field with a non-empty password to avoid a second validation error masking the email error`, async () => {
      await page
        .getByTestId("login-password-input")
        .fill(process.env.TEST_USER_PASSWORD || "SecurePass123!");
      await expect(page.getByTestId("login-password-input")).toHaveAttribute(
        "type",
        "password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Click the submit button to attempt form submission with the pasted malformed email`, async () => {
      await page.getByTestId("login-submit-button").click();

      await page.screenshot({
        path: testInfo.outputPath(`step-7.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 8: Verify email error message remains visible after attempted submission`, async () => {
      const validationMessage = await page
        .getByTestId("login-email-input")
        .evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage).toContain("@");

      await page.screenshot({
        path: testInfo.outputPath(`step-8.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 9: Verify the page URL has not changed (user was not redirected or shown a server error)`, async () => {
      await page.getByTestId("login-email-input").waitFor({ state: "visible" });
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(baseUrl + "/login");

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
