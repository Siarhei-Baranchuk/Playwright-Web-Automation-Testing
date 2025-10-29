import { defineConfig, devices } from "@playwright/test";

import dotenv from "dotenv";
dotenv.config({ quiet: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["list"], ["html", { open: "on-failure" }], ["allure-playwright", { outputFolder: "allure-results" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:4200",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: "qa-env",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     baseURL: "http://localhost:QA",
    //   },
    // },
    // {
    //   name: "stage-env",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     baseURL: "http://localhost:STAGE",
    //   },
    // },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "mobile",
      testMatch: "6testMobile.spec.ts",
      use: {
        ...devices["iPhone 14 Pro"],
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:4200",
  },
});
