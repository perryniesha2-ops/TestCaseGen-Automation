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
    ["./synthqa-reporter.ts", { suiteId: "92e15fe4-8db3-46bc-a9ad-c94603e5cf78" }],
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
