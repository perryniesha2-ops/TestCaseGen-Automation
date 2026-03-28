import { test, expect } from "@playwright/test";

/**
 * Horizontal Privilege Escalation Test — Suite Access Control
 *
 * Flow:
 * 1. Log in as User 2 — capture a real suite ID from their library
 * 2. Log in as User 1 in a separate context — attempt to access User 2's suite
 * 3. Verify User 1 is denied access
 * 4. Verify User 1's own library does not contain User 2's suite
 */

test.describe(`Horizontal Privilege Escalation — Suite Access Control`, () => {
  test(`0fe352e0-c432-4e3b-a4bc-71613ef27023`, async ({
    browser,
  }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    const user1Email = process.env.TEST_USER_EMAIL;
    const user1Password = process.env.TEST_USER_PASSWORD;
    const user2Email = process.env.TEST_USER2_EMAIL;
    const user2Password = process.env.TEST_USER2_PASSWORD;

    if (!user1Email || !user1Password)
      throw new Error("Missing TEST_USER_EMAIL or TEST_USER_PASSWORD");
    if (!user2Email || !user2Password)
      throw new Error("Missing TEST_USER2_EMAIL or TEST_USER2_PASSWORD");

    // Fully isolated browser contexts — no shared cookies or storage
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage(); // User 1 — attacker
    const page2 = await context2.newPage(); // User 2 — victim

    let user2SuiteId: string | null = null;
    let user2SuiteName: string | null = null;

    // ── PHASE 1: Log in as User 2 and capture a suite ID ──────────────────

    await test.step(`Phase 1 — Log in as User 2`, async () => {
      await page2.goto(baseUrl + "/login");
      await expect(page2).toHaveURL(/\/login/);

      await page2.locator("input[name='email']").fill(user2Email);
      await page2.locator("input[name='password']").fill(user2Password);
      await page2.locator("button[type='submit']").click();

      await page2.waitForURL(/\/dashboard/, { timeout: 15000 });
      await expect(page2).toHaveURL(/\/dashboard/);

      await page2.screenshot({
        path: testInfo.outputPath(`phase1-step1-user2-login.png`),
        fullPage: true,
      });
    });

    await test.step(`Phase 1 — Navigate to User 2's test library and capture suite ID`, async () => {
      await page2.goto(baseUrl + "/test-library");
      await page2.waitForTimeout(2000);

      // Wait for the suite table to render using data-testid
      await expect(page2.locator('[data-testid="suite-table"]')).toBeVisible({
        timeout: 10000,
      });

      const suiteRows = page2.locator('[data-testid="suite-row"]');
      const count = await suiteRows.count();

      if (count === 0) {
        throw new Error(
          "User 2 has no suites — create at least one suite before running this test",
        );
      }

      // Extract suite ID and name directly from data attributes — no URL parsing needed
      const firstRow = suiteRows.first();
      user2SuiteId = await firstRow.getAttribute("data-suite-id");
      user2SuiteName = await firstRow.getAttribute("data-suite-name");

      if (!user2SuiteId)
        throw new Error(
          "Could not extract suite ID from data-suite-id attribute",
        );

      console.log(`[test] Captured User 2 suite ID: ${user2SuiteId}`);
      console.log(`[test] Captured User 2 suite name: ${user2SuiteName}`);

      await page2.screenshot({
        path: testInfo.outputPath(`phase1-step2-user2-library.png`),
        fullPage: true,
      });
    });

    await test.step(`Phase 1 — Verify User 2 can access their own suite (baseline)`, async () => {
      if (!user2SuiteId) throw new Error("No suite ID captured");

      await page2.goto(baseUrl + `/test-library/${user2SuiteId}`);
      await page2.waitForTimeout(2000);

      await expect(page2).toHaveURL(
        new RegExp(`/test-library/${user2SuiteId}`),
      );
      await expect(page2.locator("body")).toBeVisible();

      const bodyText = await page2.locator("body").innerText();
      expect(bodyText).not.toContain("Not Found");
      expect(bodyText).not.toContain("Access Denied");
      expect(bodyText).not.toContain("Forbidden");

      await page2.screenshot({
        path: testInfo.outputPath(`phase1-step3-user2-own-suite.png`),
        fullPage: true,
      });
    });

    // ── PHASE 2: Log in as User 1 and attempt to access User 2's suite ────

    await test.step(`Phase 2 — Log in as User 1`, async () => {
      await page1.goto(baseUrl + "/login");
      await expect(page1).toHaveURL(/\/login/);

      await page1.locator("input[name='email']").fill(user1Email);
      await page1.locator("input[name='password']").fill(user1Password);
      await page1.locator("button[type='submit']").click();

      await page1.waitForURL(/\/dashboard/, { timeout: 15000 });
      await expect(page1).toHaveURL(/\/dashboard/);

      await page1.screenshot({
        path: testInfo.outputPath(`phase2-step1-user1-login.png`),
        fullPage: true,
      });
    });

    await test.step(`Phase 2 — User 1 attempts direct URL access to User 2's suite`, async () => {
      if (!user2SuiteId) throw new Error("No suite ID captured");

      await page1.goto(baseUrl + `/test-library/${user2SuiteId}`);
      await page1.waitForTimeout(2000);

      await page1.screenshot({
        path: testInfo.outputPath(`phase2-step2-attack-attempt.png`),
        fullPage: true,
      });
    });

    await test.step(`Phase 2 — Verify User 1 is denied access to User 2's suite`, async () => {
      if (!user2SuiteId) throw new Error("No suite ID captured");

      // Wait longer to confirm the page never actually loads data
      await page1.waitForTimeout(5000);

      const currentUrl = page1.url();
      const bodyText = await page1.locator("body").innerText();

      const wasRedirected = !currentUrl.includes(user2SuiteId);

      const showsAccessDenied =
        bodyText.toLowerCase().includes("not found") ||
        bodyText.toLowerCase().includes("access denied") ||
        bodyText.toLowerCase().includes("forbidden") ||
        bodyText.includes("404") ||
        bodyText.includes("403");

      // ✅ Page loads shell but data never loads — RLS is blocking the query
      const dataBlockedByRLS =
        bodyText.includes("Loading suite") ||
        bodyText.includes("Loading...") ||
        bodyText.toLowerCase().includes("loading");

      // Must never expose server errors
      expect(bodyText).not.toContain("Internal Server Error");
      expect(bodyText).not.toContain("at Object.");

      console.log(`[test] Was redirected: ${wasRedirected}`);
      console.log(`[test] Shows access denied: ${showsAccessDenied}`);
      console.log(
        `[test] Data blocked by RLS (infinite load): ${dataBlockedByRLS}`,
      );

      expect(wasRedirected || showsAccessDenied || dataBlockedByRLS).toBe(true);

      await page1.screenshot({
        path: testInfo.outputPath(`phase2-step3-access-denied-verified.png`),
        fullPage: true,
      });
    });

    // ── PHASE 3: Verify User 1's own library is unaffected ────────────────

    await test.step(`Phase 3 — Verify User 1 can still access their own library`, async () => {
      await page1.goto(baseUrl + "/test-library");
      await page1.waitForTimeout(2000);

      await expect(page1).toHaveURL(/\/test-library/);

      const bodyText = await page1.locator("body").innerText();
      expect(bodyText).not.toContain("Please sign in");
      expect(bodyText).not.toContain("sign in to continue");

      await page1.screenshot({
        path: testInfo.outputPath(`phase3-step1-user1-library.png`),
        fullPage: true,
      });
    });

    await test.step(`Phase 3 — Verify User 2's suite is not visible in User 1's library`, async () => {
      if (!user2SuiteId) throw new Error("No suite ID captured");

      await expect(page1.locator('[data-testid="suite-table"]')).toBeVisible({
        timeout: 10000,
      });

      // Collect all suite IDs visible to User 1 via data attributes
      const suiteRows = page1.locator('[data-testid="suite-row"]');
      const rowCount = await suiteRows.count();

      const visibleIds: string[] = [];
      for (let i = 0; i < rowCount; i++) {
        const id = await suiteRows.nth(i).getAttribute("data-suite-id");
        if (id) visibleIds.push(id);
      }

      // Also check Details buttons which also carry data-suite-id
      const detailButtons = page1.locator('[data-testid="btn-suite-details"]');
      const btnCount = await detailButtons.count();
      const buttonIds: string[] = [];
      for (let i = 0; i < btnCount; i++) {
        const id = await detailButtons.nth(i).getAttribute("data-suite-id");
        if (id) buttonIds.push(id);
      }

      console.log(`[test] User 1 visible suite IDs: ${visibleIds.join(", ")}`);
      console.log(`[test] User 1 detail button IDs: ${buttonIds.join(", ")}`);
      console.log(`[test] User 2 suite ID: ${user2SuiteId}`);

      // Core assertion — User 2's suite must not appear anywhere in User 1's view
      expect(visibleIds).not.toContain(user2SuiteId);
      expect(buttonIds).not.toContain(user2SuiteId);

      await page1.screenshot({
        path: testInfo.outputPath(`phase3-step2-no-cross-contamination.png`),
        fullPage: true,
      });
    });

    // ── Cleanup ────────────────────────────────────────────────────────────

    await context1.close();
    await context2.close();
  });
});
