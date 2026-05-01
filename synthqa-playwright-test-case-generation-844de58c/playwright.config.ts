import { defineConfig } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./tests",
  timeout: 800_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    [
      "./synthqa-reporter.ts",
      { suiteId: "844de58c-bb81-401f-a153-40f0ae610a37" },
    ],
  ],
  projects: [
    {
      name: "chromium",
      testMatch: /.*.spec.ts/,
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
