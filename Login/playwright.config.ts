import { defineConfig } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["./synthqa-reporter.ts", { suiteId: "8222510c-e285-488a-a8a9-1a9522531b7f" }],
  ],
  projects: [
    {
      name: "chromium",
      testMatch: /.*.spec.ts/,
      use: {
        baseURL: process.env.BASE_URL || "https://dev.synthqa.app",
        headless: true,
        trace: "on-first-retry",
        screenshot: "on",
        video: "retain-on-failure",
      },
    },
  ],
});
