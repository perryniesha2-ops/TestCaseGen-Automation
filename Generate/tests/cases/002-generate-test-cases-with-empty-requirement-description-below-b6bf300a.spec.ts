import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["b6bf300a-dcd8-4e68-8a11-583476ede9db"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases with Empty Requirement Description (Below Minimum String Length)`, () => {
  test(`b6bf300a-dcd8-4e68-8a11-583476ede9db`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step(`Step 1: Navigate to the test case generation page`, async () => {
      await page.goto(baseUrl + "/generate");
      await expect(page).toHaveURL(baseUrl + "/generate");

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Ensure the requirement title input is empty (clear any pre-filled content)`, async () => {
      await page
        .locator('[data-testid="input-generation-title"]')
        .fill("Empty Req Test");
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue("Empty Req Test");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Ensure the requirement description input is empty (clear any pre-filled content)`, async () => {
      await page
        .locator('[data-testid="input-generation-description"]')
        .fill("Empty Req Description");
      await expect(
        page.locator('[data-testid="input-generation-description"]'),
      ).toHaveValue("Empty Req Description");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Set Empty Requirement Field`, async () => {
      await page.locator('[data-testid="textarea-requirements"]').fill("");
      await expect(
        page.locator('[data-testid="textarea-requirements"]'),
      ).toHaveValue("");

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Click the Generate Test Cases button`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();
      await expect(page.locator("[data-sonner-toaster]")).toContainText(
        "Please enter your requirements.",
      );

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
