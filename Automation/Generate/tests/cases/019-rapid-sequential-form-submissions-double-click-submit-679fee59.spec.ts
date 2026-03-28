import { test, expect } from "../fixtures";

test.describe(`Rapid Sequential Form Submissions (Double-Click Submit)`, () => {
  test(`679fee59-fcbb-41b4-8858-eb0670224902`, async ({ page }, testInfo) => {
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
        .fill("Double Submit Test");
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue("Double Submit Test");
      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill in description`, async () => {
      await page
        .locator('[data-testid="input-generation-description"]')
        .fill("Testing rapid sequential form submissions");
      await expect(
        page.locator('[data-testid="input-generation-description"]'),
      ).toHaveValue("Testing rapid sequential form submissions");
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Fill in requirements`, async () => {
      await page
        .locator('[data-testid="textarea-requirements"]')
        .fill(
          "User authentication with OAuth2.0 including login, logout, token refresh, and session management across multiple devices and browsers.",
        );
      await expect(
        page.locator('[data-testid="textarea-requirements"]'),
      ).toHaveValue(
        "User authentication with OAuth2.0 including login, logout, token refresh, and session management across multiple devices and browsers.",
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Set test case count to 5`, async () => {
      await page.locator('[data-testid="select-test-case-count"]').click();
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

    await test.step(`Step 6: Click submit and immediately attempt a second click`, async () => {
      const submitBtn = page.locator('[data-testid="btn-generate"]');

      // First click — triggers submission
      await submitBtn.click();

      // Button should immediately become disabled and show loading text
      await expect(submitBtn).toBeDisabled();
      await expect(submitBtn).toContainText("Generating test cases");

      // Attempt second click — should have no effect since button is disabled
      await submitBtn.click({ force: true }); // force to bypass pointer-events: none

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Verify button stays disabled during generation`, async () => {
      const submitBtn = page.locator('[data-testid="btn-generate"]');

      // Button should still be disabled and showing loading state
      await expect(submitBtn).toBeDisabled();
      await expect(submitBtn).toContainText("Generating test cases");

      await page.screenshot({
        path: testInfo.outputPath(`step-7.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 8: Verify redirect to test cases page after generation completes`, async () => {
      // Wait for generation to complete and redirect
      await page.waitForURL(/\/test-cases/, { timeout: 60000 });
      await expect(page).toHaveURL(/\/test-cases/);
      await page.screenshot({
        path: testInfo.outputPath(`step-8.png`),
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
