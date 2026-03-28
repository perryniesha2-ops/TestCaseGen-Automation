import { test, expect } from "../fixtures";

test.describe(`Generated Test Cases Are Displayed After Submission`, () => {
  test(`c6ba24ee-9654-445e-94a0-5d78fc00ce8f`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Type generation title`, async () => {
      await page.locator("input#title").fill("Coupon Code Test");
      await expect(page.locator("input#title")).toHaveValue("Coupon Code Test");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Type generation description`, async () => {
      await page
        .locator("input#description")
        .fill("Testing discount coupon code functionality on checkout page");
      await expect(page.locator("input#description")).toHaveValue(
        "Testing discount coupon code functionality on checkout page",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Set test case count`, async () => {
      const counts = ["5", "10", "15", "20"];
      const randomCount = counts[Math.floor(Math.random() * counts.length)];

      // Click the trigger to open the dropdown
      await page.locator("[data-slot='select-trigger']").nth(3).click();

      // Wait for the dropdown to open then click the option
      await page
        .getByRole("option", { name: `${randomCount} test cases` })
        .click();

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Type requirement in textarea`, async () => {
      await page
        .locator("textarea#custom-requirements")
        .fill(
          "The checkout page should allow users to apply a discount coupon code before payment.",
        );
      await expect(page.locator("textarea#custom-requirements")).toHaveValue(
        "The checkout page should allow users to apply a discount coupon code before payment.",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Click Generate Test Cases button`, async () => {
      await page.locator("button[type='submit']").click();

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Verify redirect to test cases page`, async () => {
      // Generation can take a while — wait up to 60s for the redirect
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
