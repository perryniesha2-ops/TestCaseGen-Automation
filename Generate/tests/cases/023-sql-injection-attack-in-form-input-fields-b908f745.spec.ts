import { test, expect } from "../fixtures";

// SQL injection payloads to test
const SQL_INJECTION_TITLE = "SQL Injection Test";
const SQL_INJECTION_REQUIREMENTS = `' OR '1'='1; DROP TABLE users; SELECT * FROM test_cases WHERE '1'='1
UNION SELECT username, password FROM users --
Admin'--`;

test.describe(`SQL Injection Attack in Form Input Fields`, () => {
  test(`b908f745-cee6-4967-9771-df8fda62b1cc`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill title with SQL injection payload`, async () => {
      await page
        .locator('[data-testid="input-generation-title"]')
        .fill(SQL_INJECTION_TITLE);
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue(SQL_INJECTION_TITLE);
      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill requirements with SQL injection payload`, async () => {
      await page
        .locator('[data-testid="textarea-requirements"]')
        .fill(SQL_INJECTION_REQUIREMENTS);
      await expect(
        page.locator('[data-testid="textarea-requirements"]'),
      ).toHaveValue(SQL_INJECTION_REQUIREMENTS);
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Submit the form`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();

      // Button should disable immediately — form is processing
      await expect(page.locator('[data-testid="btn-generate"]')).toBeDisabled();
      await expect(page.locator('[data-testid="btn-generate"]')).toContainText(
        "Generating test cases",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify no database error or stack trace is exposed`, async () => {
      // Wait for the page to settle — either redirect or error state
      await page.waitForTimeout(3000);

      const bodyText = await page.locator("body").innerText();

      // These strings appearing on the page indicate a SQL injection vulnerability
      expect(bodyText).not.toContain("SQL syntax");
      expect(bodyText).not.toContain("mysql_fetch");
      expect(bodyText).not.toContain("ORA-");
      expect(bodyText).not.toContain("PostgreSQL");
      expect(bodyText).not.toContain("stack trace");
      expect(bodyText).not.toContain("at Object.");
      expect(bodyText).not.toContain("Internal Server Error");

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify page is still functional after injection attempt`, async () => {
      // The app should either redirect to test cases or stay on generate
      // It should NOT show a blank page, crash, or expose raw errors
      await expect(page.locator("body")).toBeVisible();

      const currentUrl = page.url();
      const isOnGeneratePage = currentUrl.includes("/generate");
      const isOnTestCasesPage = currentUrl.includes("/test-cases");

      // Must be on one of these two pages — not an error page
      expect(isOnGeneratePage || isOnTestCasesPage).toBe(true);

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
