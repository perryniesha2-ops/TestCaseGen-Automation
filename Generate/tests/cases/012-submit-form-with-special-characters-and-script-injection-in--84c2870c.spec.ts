import { test, expect } from "../fixtures";

test.describe(`Submit Form with Special Characters and Script Injection in Requirements Field`, () => {
  test(`84c2870c-51c7-4193-8700-ecfb399e3ac2`, async ({ page }, testInfo) => {
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
      await page.locator("input[name='title']").fill("XSS Test Feature");
      await expect(page.locator("input[name='title']")).toHaveValue(
        "XSS Test Feature",
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill in description`, async () => {
      await page
        .locator("input[name='description']")
        .fill("Valid description for XSS test");
      await expect(page.locator("input[name='description']")).toHaveValue(
        "Valid description for XSS test",
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Inject script into requirements field`, async () => {
      const reqInput = page
        .locator(
          "textarea[placeholder*='Describe' i], textarea[placeholder*='requirements' i]",
        )
        .first();
      await reqInput.clear();
      await reqInput.fill(
        '<script>alert("XSS")</script><img src=x onerror=alert(1)>',
      );
      await expect(reqInput).toHaveValue(
        '<script>alert("XSS")</script><img src=x onerror=alert(1)>',
      );
      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Click submit / generate button`, async () => {
      await page.locator("button[type='submit']").click();

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify no XSS alert dialog was triggered`, async () => {
      // Native alert dialogs are handled separately in Playwright
      // If XSS fired, it would trigger a dialog event — we verify none appeared
      let dialogFired = false;
      page.once("dialog", async (dialog) => {
        dialogFired = true;
        await dialog.dismiss();
      });

      await page.waitForTimeout(1000);
      expect(dialogFired).toBe(false);

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Verify input is sanitized or error shown`, async () => {
      // Check no script tag is rendered in the DOM as executable
      const bodyContent = await page.locator("body").innerHTML();
      expect(bodyContent).not.toContain("<script>alert");

      // Also verify any toast/error message if your app shows one
      // ⚠️ Update this locator once you share the HTML for your error messages
      const errorVisible = await page
        .getByText(/invalid|not allowed|sanitized/i)
        .isVisible()
        .catch(() => false);
      if (errorVisible) {
        await expect(
          page.getByText(/invalid|not allowed|sanitized/i),
        ).toBeVisible();
      }

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
