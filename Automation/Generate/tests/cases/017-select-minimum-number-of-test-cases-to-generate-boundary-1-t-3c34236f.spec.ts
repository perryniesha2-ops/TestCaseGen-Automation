import { test, expect } from "../fixtures";

test.describe(`Select minimum number of test cases to generate (boundary: 5 test cases)`, () => {
  test(`3c34236f-2e5d-4c77-bb40-5fbb3335ba17`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    });

    await test.step(`Step 1: Navigate to /generate`, async () => {
      await page.goto(baseUrl + "/generate");
      await expect(page).toHaveURL(/\/generate/);
      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Fill in title`, async () => {
      await page
        .locator('[data-testid="input-generation-title"]')
        .fill("Boundary Test - Minimum Count");
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue("Boundary Test - Minimum Count");
      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill in description`, async () => {
      await page
        .locator('[data-testid="input-generation-description"]')
        .fill("Testing minimum test case count boundary");
      await expect(
        page.locator('[data-testid="input-generation-description"]'),
      ).toHaveValue("Testing minimum test case count boundary");
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Fill in requirements`, async () => {
      await page
        .locator('[data-testid="textarea-requirements"]')
        .fill(
          "Verify the login page displays email and password fields and a submit button. The form should validate required fields and show appropriate error messages when submitted empty.",
        );
      await expect(
        page.locator('[data-testid="textarea-requirements"]'),
      ).toHaveValue(
        "Verify the login page displays email and password fields and a submit button. The form should validate required fields and show appropriate error messages when submitted empty.",
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Set test case count to 5`, async () => {
      await page.locator('[data-testid="select-test-case-count"]').click();

      // exact: true prevents "15 test cases" from matching "5 test cases"
      await page
        .getByRole("option", { name: "5 test cases", exact: true })
        .click();

      await expect(
        page.locator('[data-testid="select-test-case-count"]'),
      ).toContainText("5 test cases");
      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Click Generate Test Cases button`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();
      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Verify redirect to test cases page`, async () => {
      await page.waitForURL(/\/test-cases/, { timeout: 60000 });
      await expect(page).toHaveURL(/\/test-cases/);
      await page.screenshot({
        path: testInfo.outputPath(`step-7.png`),
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
