import { test, expect } from "../fixtures";

// Unicode test content stored as a constant for clarity and reuse
const UNICODE_REQUIREMENTS = `✅ User must log in 🔐
System should validate credentials
- Support für Ünïcödé input
→ Redirect on success after successful authentication and session creation`;

test.describe(`Paste Requirements Text Containing Mixed Unicode, Emoji, and Line Breaks`, () => {
  test(`88af18d6-d0dd-446a-b807-85d40c160550`, async ({ page }, testInfo) => {
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
        .fill("Unicode Requirements Test");
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue("Unicode Requirements Test");
      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill in description`, async () => {
      await page
        .locator('[data-testid="input-generation-description"]')
        .fill("Testing unicode, emoji and special characters in requirements");
      await expect(
        page.locator('[data-testid="input-generation-description"]'),
      ).toHaveValue(
        "Testing unicode, emoji and special characters in requirements",
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Fill requirements with unicode, emoji and line breaks`, async () => {
      const textarea = page.locator('[data-testid="textarea-requirements"]');

      // Use fill() — Playwright handles unicode natively, no special escaping needed
      await textarea.fill(UNICODE_REQUIREMENTS);

      // Verify the full content including line breaks was accepted
      await expect(textarea).toHaveValue(UNICODE_REQUIREMENTS);

      // Verify character count hint is not showing (content is long enough)
      await expect(
        page.locator('[data-testid="requirements-char-hint"]'),
      ).toBeEmpty();

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Submit the form`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();

      // Button should immediately disable and show loading state
      await expect(page.locator('[data-testid="btn-generate"]')).toBeDisabled();
      await expect(page.locator('[data-testid="btn-generate"]')).toContainText(
        "Generating test cases",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify redirect to test cases page`, async () => {
      // Wait for generation to complete — unicode content should process without errors
      await page.waitForURL(/\/test-cases/, { timeout: 60000 });
      await expect(page).toHaveURL(/\/test-cases/);
      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
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
