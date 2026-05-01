import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["1f2ab8ef-efd5-476f-a7dd-9ca5ee74ee61"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Successfully Generate Test Cases With Valid Requirement and Default Template`, () => {
  test(`1f2ab8ef-efd5-476f-a7dd-9ca5ee74ee61`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step(`Step 1: Navigate to the test case generator page`, async () => {
      await page.goto(baseUrl + "/generate");
      await expect(page).toHaveURL(baseUrl + "/generate");

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Click Saved Requirements button `, async () => {
      await page.locator('[data-testid="btn-mode-saved"]').click();

      await expect(
        page.locator('[data-testid="select-saved-requirement"]'),
      ).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Select a saved requirement from the requirements dropdown`, async () => {
      await page.locator('[data-testid="select-saved-requirement"]').click();
      await page.waitForTimeout(2000);

      await page
        .getByRole("option", {
          name: "User Authentication Login Screen (functional)",
        })
        .click();

      await expect(
        page.locator('[data-testid="select-saved-requirement"]'),
      ).toHaveText("User Authentication Login Screen (functional)");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Select the default template from the template dropdown`, async () => {
      await page.locator('[data-testid="select-test-case-count"]').click();
      await page.locator('[name="testCaseCount"]').selectOption({ value: "5" });
      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Click the Generate Test Cases button`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();
      await expect(page.getByTestId("btn-generate")).toBeDisabled();

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Wait for the test case results to appear`, async () => {
      await page.waitForURL(/\/test-cases/, { timeout: 180000 });
      await expect(page).toHaveURL(/\/test-cases/);

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify the generated test cases list is populated`, async () => {
      const cellText = await page.locator("span.truncate").first().innerText();
      expect(cellText.trim().length).toBeGreaterThan(0);

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
