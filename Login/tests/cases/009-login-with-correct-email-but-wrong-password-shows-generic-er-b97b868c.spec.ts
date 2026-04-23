import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["b97b868c-cdb0-44b0-aa11-227692d1d302"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Login With Correct Email But Wrong Password Shows Generic Error Without Revealing Account Existence`, () => {
  test(`b97b868c-cdb0-44b0-aa11-227692d1d302`, async ({ page }, testInfo) => {
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

    await test.step(`Step 3: Fill the password field with an incorrect password`, async () => {
      await page.getByTestId("login-password-input").fill("SecurePass123!");
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
      await expect(page.getByTestId("login-submit-button")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the error message text is generic and non-revealing`, async () => {
      await expect(page.locator("[data-sonner-toast]")).toBeVisible();
      await expect(page.locator("[data-sonner-toast]")).toContainText(
        "Invalid email or password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify no redirect to dashboard occurred`, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await expect(page).toHaveURL(baseUrl + "/login");

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
