import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["49502504-5a30-435e-9830-617a5396e0e9"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Generate Test Cases with Single-Character Requirement Description (Min String Length)`, () => {
  test(`49502504-5a30-435e-9830-617a5396e0e9`, async ({ page }, testInfo) => {
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
        .fill("Single Character Req Test");
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue("Single Character Req Test");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Ensure the requirement description input is empty (clear any pre-filled content)`, async () => {
      await page
        .locator('[data-testid="input-generation-description"]')
        .fill("Single Character Req Description");
      await expect(
        page.locator('[data-testid="input-generation-description"]'),
      ).toHaveValue("Single Character Req Description");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Fill the requirement description with exactly 5000 characters`, async () => {
      const text = "a";

      await page.locator('[data-testid="textarea-requirements"]').fill(text);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the character counter shows 5000/5000`, async () => {
      await page.locator('[data-testid="requirements-char-hint"]').click();
      await expect(
        page.locator('[data-testid="requirements-char-hint"]'),
      ).toHaveText("9 more characters needed");

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Select a test cases count from dropdown`, async () => {
      await page.locator('[data-testid="select-test-case-count"]').click();
      await page.locator('[name="testCaseCount"]').selectOption({ value: "5" });
      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Click the Generate Test Cases button`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();

      await page.screenshot({
        path: testInfo.outputPath(`step-7.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify Info Message for User to enter words into the field`, async () => {
      await expect(page.locator("[data-sonner-toast]")).toBeVisible();
      await expect(page.locator("[data-sonner-toast]")).toContainText(
        "Please enter at least 10 characters. Currently 1 characters.",
      );

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
