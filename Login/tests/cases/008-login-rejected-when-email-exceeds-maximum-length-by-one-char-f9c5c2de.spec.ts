import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["f9c5c2de-11a6-4b6b-a951-60451163c59d"]?.requires_auth ?? false;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Character count validation when email exceeds maximum length by one character (255 characters)`, () => {
  test(`f9c5c2de-11a6-4b6b-a951-60451163c59d`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill the email field with a 255-character email address`, async () => {
      const inputString =
        "afroaivisionaries+aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com";

      // Sanity check — make sure your input is actually the length you think
      console.log("Input length:", inputString.length); // should be 255

      await page.getByTestId("login-email-input").fill(inputString);

      const value = await page.getByTestId("login-email-input").inputValue();
      console.log("Field value length:", value.length); // should be 254 if maxlength=254

      // Assert the field truncated to the max allowed length
      expect(value.length).toBe(254); // or whatever maxlength is

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
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
