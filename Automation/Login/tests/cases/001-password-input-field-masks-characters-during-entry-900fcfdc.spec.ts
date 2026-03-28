import { test, expect } from "@playwright/test";

test.describe(`Password Input Field Masks Characters During Entry`, () => {
  test(`900fcfdc-1338-4199-8fc4-d36820583e00`, async ({ page }, testInfo) => {
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

    await test.step(`Step 2: Click on the password input field`, async () => {
      await page.locator("input[name='password']").click();
      await expect(page.locator("input[name='password']")).toBeVisible();

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Type MyVisiblePassword99 in the password input field`, async () => {
      await page
        .locator("input[name='password']")
        .pressSequentially("MyVisiblePassword99");
      await expect(page.locator("input[name='password']")).toHaveValue(
        "MyVisiblePassword99",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-3.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Verify the attribute type of input[name='password'] equals password`, async () => {
      await page
        .locator("input[name='password']")
        .waitFor({ state: "visible" });
      await expect(page.locator("input[name='password']")).toHaveAttribute(
        "type",
        "password",
      );

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify password field masks the input`, async () => {
      await page
        .locator("input[name='password']")
        .waitFor({ state: "visible" });

      // Value is present but masked because type="password"
      await expect(page.locator("input[name='password']")).toHaveValue(
        "MyVisiblePassword99",
      );
      await expect(page.locator("input[name='password']")).toHaveAttribute(
        "type",
        "password",
      );

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
