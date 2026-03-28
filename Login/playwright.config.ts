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
    ["./synthqa-reporter.ts", { suiteId: "ce2ed0ed-bb83-4e86-a444-7d2dccd409fa" }],
  ],  
  projects: [
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: {
        baseURL: process.env.BASE_URL || "https://dev.synthqa.app/",
        headless: true,
        trace: "on-first-retry",
        screenshot: "on",
        video: "retain-on-failure",
      },
    },
  ],
});
