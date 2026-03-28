import { test, expect } from "../fixtures";

test.describe(`Export generated test cases as a downloadable file`, () => {
  test(`468aecbc-5934-4065-bab3-3b07369b824e`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    });

    await test.step(`Step 1: Navigate to baseUrl/test-cases`, async () => {
      await page.goto(baseUrl + "/test-cases");
      await expect(page).toHaveURL(/\/test-cases/);

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Click the button with text 'Export'`, async () => {
      await page
        .locator('[data-slot="dropdown-menu-trigger"]')
        .filter({ hasText: "Export" })
        .click();
      await expect(
        page
          .locator('[data-slot="dropdown-menu-trigger"]')
          .filter({ hasText: "Export" }),
      ).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Click the button with text 'Export as Gherkin BDD'`, async () => {
      await page
        .locator('[data-slot="dropdown-menu-item"]')
        .filter({ hasText: "Gherkin/BDD" })
        .click();

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step("Verify Gherkin/BDD file downloads successfully", async () => {
      // Set up download listener BEFORE clicking
      const downloadPromise = page.waitForEvent("download");

      await page.getByRole("button", { name: "Export" }).click();
      await page.waitForTimeout(300);
      await page.getByRole("menuitem", { name: "Gherkin/BDD" }).click();

      // Wait for the download to start
      const download = await downloadPromise;

      // Verify the filename
      expect(download.suggestedFilename()).toMatch(/\.feature$|gherkin|bdd/i);

      await page.screenshot({
        path: testInfo.outputPath("step-3.png"),
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
