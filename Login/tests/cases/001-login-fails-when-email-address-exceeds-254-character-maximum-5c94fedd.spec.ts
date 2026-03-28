import { test, expect } from "@playwright/test";

test.describe(`Login Succeeds at Maximum Allowable Email Length (254 Characters)`, () => {
  test(`36716d99-0774-48d1-881a-c106d15348cd`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step("Navigate to application", async () => {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    });

    await test.step(`Step 1: Navigate to https://dev.synthqa.app/login`, async () => {
      await page.goto("https://dev.synthqa.app/login");
      await expect(page).toHaveURL(/\/login/);

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Type \`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com\` (254 chars) in the email input field`, async () => {
      await page
        .locator("input[name='email']")
        .pressSequentially(
          process.env.TEST_USER_254EMAIL ||
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com",
        );
      await expect(page.locator("input[name='email']")).toHaveValue(
        process.env.TEST_USER_254EMAIL ||
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Type \`BoundaryPass@99\` in the password input field`, async () => {
      await page
        .locator("input[name='password']")
        .pressSequentially(process.env.TEST_USER_PASSWORD || "BoundaryPass@99");
      await expect(page.locator("input[name='password']")).toHaveAttribute(
        "type",
        "password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Click the button with text \`Sign In\``, async () => {
      await page.locator("button[type='submit']").click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/dashboard/);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the page URL contains \`/dashboard\``, async () => {
      await page.locator("body").waitFor({ state: "visible" });
      await expect(page).toHaveURL(/\/dashboard/);

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
