import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;
    const baseUrl = process.env.BASE_URL;

    if (email && password && baseUrl) {
      await page.goto(baseUrl + '/login');
      await page.fill('[name="email"]', email);
      await page.fill('[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {});
    }

    await use(page);
  },
});

export { expect } from '@playwright/test';
