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
    ["./synthqa-reporter.ts", { suiteId: "37294ea6-4b0e-452d-ad17-dad7ad5b5eda" }],
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
