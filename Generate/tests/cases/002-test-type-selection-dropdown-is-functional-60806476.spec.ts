import { test, expect } from "../fixtures";

test.describe(`Test Type Selection Dropdown Is Functional`, () => {
  test(`60806476-c43d-4af7-861d-ab629c53bc32`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    });

    await test.step(`Step 1: Navigate to /generate`, async () => {
      await page.goto(baseUrl + "/generate");
      await page.waitForTimeout(3000);
      await expect(page).toHaveURL(/\/generate/);

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Verify test types multiselect is visible`, async () => {
      const multiselect = page
        .locator('button[role="combobox"][aria-haspopup="dialog"]')
        .filter({ hasText: /Happy Path|Negative|Boundary|Select test types/ });

      await multiselect.waitFor({ state: "visible" });
      await expect(multiselect).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Open the test types dropdown`, async () => {
      const multiselect = page
        .locator('button[role="combobox"][aria-haspopup="dialog"]')
        .filter({ hasText: /Happy Path|Negative|Boundary|Select test types/ });

      await multiselect.click();
      await page.waitForTimeout(500);

      // Verify dropdown opened
      await expect(
        page.locator('[role="dialog"], [cmdk-root]').first(),
      ).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Select 'Security' test type`, async () => {
      await page.getByRole("option", { name: "Security" }).click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify 'Security' badge is visible in the trigger`, async () => {
      const multiselect = page
        .locator('button[role="combobox"][aria-haspopup="dialog"]')
        .filter({ hasText: /Happy Path|Negative|Boundary|Select test types/ });

      // Close the dropdown first by clicking elsewhere
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      // Verify Security badge appears in the trigger button
      await expect(multiselect).toContainText("Security");

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step("Expected Result", async () => {
      await page.screenshot({
        path: testInfo.outputPath("final.png"),
        fullPage: true,
      });
    });
  });
});
