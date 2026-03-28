import { test, expect } from "../fixtures";

const PATH_TRAVERSAL_REQUIREMENTS = `../../etc/passwd
..%2F..%2Fetc%2Fshadow
../../../../windows/system32/config/sam
Test that the application handles file path inputs securely without exposing server file system contents.`;

const PATH_TRAVERSAL_TITLE = "Path Traversal Security Test";

test.describe(`Path Traversal Attack in File-Related Form Inputs`, () => {
  test(`8effe351-d41c-4ac7-b378-e074fcf5895d`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Fill title`, async () => {
      await page
        .locator('[data-testid="input-generation-title"]')
        .fill(PATH_TRAVERSAL_TITLE);
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue(PATH_TRAVERSAL_TITLE);
      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Fill requirements with path traversal payloads`, async () => {
      await page
        .locator('[data-testid="textarea-requirements"]')
        .fill(PATH_TRAVERSAL_REQUIREMENTS);
      await expect(
        page.locator('[data-testid="textarea-requirements"]'),
      ).toHaveValue(PATH_TRAVERSAL_REQUIREMENTS);
      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Submit the form`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();

      await expect(page.locator('[data-testid="btn-generate"]')).toBeDisabled();
      await expect(page.locator('[data-testid="btn-generate"]')).toContainText(
        "Generating test cases",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify no server file system content is exposed`, async () => {
      await page.waitForTimeout(3000);

      const bodyText = await page.locator("body").innerText();

      // These strings appearing would indicate a successful path traversal
      expect(bodyText).not.toContain("root:x:0:0"); // /etc/passwd content
      expect(bodyText).not.toContain("root:$"); // /etc/shadow content
      expect(bodyText).not.toContain("[boot loader]"); // windows boot.ini
      expect(bodyText).not.toContain("Administrator:500"); // windows SAM file

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify no server error or stack trace is exposed`, async () => {
      const bodyText = await page.locator("body").innerText();

      // These would indicate the server crashed or leaked internals
      expect(bodyText).not.toContain("ENOENT"); // Node.js file not found error
      expect(bodyText).not.toContain("No such file"); // filesystem error
      expect(bodyText).not.toContain("Permission denied"); // filesystem error
      expect(bodyText).not.toContain("stack trace"); // server crash
      expect(bodyText).not.toContain("at Object."); // Node.js stack trace

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Verify app remains functional after attack attempt`, async () => {
      await page.waitForURL(/\/test-cases|\/generate/, { timeout: 60000 });

      const currentUrl = page.url();
      expect(
        currentUrl.includes("/test-cases") || currentUrl.includes("/generate"),
      ).toBe(true);

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
