import { test, expect } from "@playwright/test";
import testData from "../test-data/testData.json";

test.beforeEach(async ({ page }) => {});

test("Mock API tags from JSON and verify display", async ({ page }) => {
  // Intercept API request to /api/tags
  await page.route("*/**/api/tags", async (route) => {
    // Replace response with data from JSON file
    await route.fulfill({
      body: JSON.stringify(testData.tags),
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // status: 200,
    });
  });

  await page.goto("https://conduit.bondaracademy.com/");
  await expect(page.locator(".navbar-brand")).toHaveText("conduit");

  // Verify mocked tags are displayed on the page
  await expect(page.locator(".tag-list .tag-default").first()).toHaveText("Automation");
  await expect(page.locator(".tag-list .tag-default").nth(1)).toHaveText("Playwright");
});

test("Modify - API articles response and verify", async ({ page }) => {
  // Intercept API request to /api/articles
  await page.route("*/**/api/articles*", async (route) => {
    // Fetch original response
    const response = await route.fetch();
    const responseBody = await response.json();

    // Modify first article title and description
    responseBody.articles[0].title = "This is test Title";
    responseBody.articles[0].description = "This is test Description";

    // Return modified response
    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify modified article data is displayed
  await expect(page.locator("app-article-list h1").first()).toContainText("This is test Title");
  await expect(page.locator("app-article-list p").first()).toContainText("This is test Description");
});

test("Mock empty articles list", async ({ page }) => {
  // Mock - return empty articles array
  await page.route("*/**/api/articles*", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ articles: [], articlesCount: 0 }),
    });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify "No articles" message is displayed
  await expect(page.locator("app-article-list")).toContainText("No articles are here");
});

test("Modify - very long article title and description", async ({ page }) => {
  // Modify - set extremely long title and description to test UI layout
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();

    // Create very long title with spaces (realistic text)
    const longTitleWords = "This is a very long article title that should test UI overflow handling ";
    responseBody.articles[0].title = longTitleWords.repeat(10); // ~700 characters

    // Create very long description with spaces
    const longDescWords = "This is a very long article description that should test UI overflow handling ";
    responseBody.articles[0].description = longDescWords.repeat(20); // ~1700 characters

    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify long title and description are displayed (truncated or wrapped)
  await expect(page.locator("app-article-list h1").first()).toBeVisible();
  await expect(page.locator("app-article-list p").first()).toBeVisible();
});

test("Modify - special characters in article content", async ({ page }) => {
  // Modify - test XSS and special symbols handling
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();

    // Special characters that should be escaped
    responseBody.articles[0].title = "<script>alert('XSS')</script>";
    responseBody.articles[0].description = "Test ' \" < > & symbols";

    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify special characters are properly escaped (not executed as code)
  await expect(page.locator("app-article-list h1").first()).toContainText("<script>");
  await expect(page.locator("app-article-list p").first()).toContainText("' \" < > &");
});

test("Modify - high favorites count", async ({ page }) => {
  // Modify - set very high favorites count
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();

    // Set high number of favorites
    responseBody.articles[0].favoritesCount = 999999;

    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify high count is displayed correctly
  await expect(page.locator("app-article-list app-favorite-button").first()).toContainText("999999");
});

test("Mock API error response", async ({ page }) => {
  // Mock - return 500 error
  await page.route("*/**/api/articles*", async (route) => {
    await route.fulfill({
      status: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify error handling (could be error message or empty state)
  // Note: Actual behavior depends on app implementation
  await expect(page.locator("app-article-list")).toBeVisible();
});

test("Modify - slow API with loading state", async ({ page }) => {
  // Modify - add artificial delay to test loading indicator
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();

    // Add 3 second delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await route.fulfill({
      body: await response.text(),
    });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify content eventually loads after delay
  await expect(page.locator("app-article-list h1").first()).toBeVisible({ timeout: 10000 });
});

test("Combined mocking - tags and articles", async ({ page }) => {
  // Mock tags - complete replacement
  await page.route("*/**/api/tags", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ tags: ["TestTag1", "TestTag2", "TestTag3"] }),
    });
  });

  // Modify articles - change real data
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();
    const body = await response.json();

    // Modify first article
    body.articles[0].title = "Combined Mock Title";
    body.articles[0].description = "Testing combined approach";

    await route.fulfill({ body: JSON.stringify(body) });
  });

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Verify both mocks work together
  await expect(page.locator(".tag-list .tag-default").first()).toHaveText("TestTag1");
  await expect(page.locator("app-article-list h1").first()).toContainText("Combined Mock Title");
});

test("Modify - add custom field to articles", async ({ page }) => {
  let originalData: any = null;

  // Modify - add new fields to test extensibility
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();

    // Save original data for comparison
    originalData = JSON.parse(JSON.stringify(responseBody.articles[0]));
    console.log("\n=== ORIGINAL ARTICLE DATA (from server) ===");
    console.log(JSON.stringify(originalData, null, 2));

    // Add custom fields to all articles
    responseBody.articles.forEach((article: any) => {
      article.isSponsored = true;
      article.sponsorName = "Test Sponsor";
      article.premium = false;
    });

    console.log("\n=== MODIFIED ARTICLE DATA (with custom fields) ===");
    console.log(JSON.stringify(responseBody.articles[0], null, 2));

    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  // Wait for API response and capture it
  const responsePromise = page.waitForResponse("*/**/api/articles*");

  // Navigate to the page
  await page.goto("https://conduit.bondaracademy.com/");

  // Get the API response
  const apiResponse = await responsePromise;
  const responseBody = await apiResponse.json();

  console.log("\n=== RECEIVED BY BROWSER ===");
  console.log("Total articles:", responseBody.articles.length);
  console.log("First article custom fields:");
  console.log("  - isSponsored:", responseBody.articles[0].isSponsored);
  console.log("  - sponsorName:", responseBody.articles[0].sponsorName);
  console.log("  - premium:", responseBody.articles[0].premium);

  // Verify custom fields were added to the response
  expect(responseBody.articles.length).toBeGreaterThan(0);
  expect(responseBody.articles[0]).toHaveProperty("isSponsored", true);
  expect(responseBody.articles[0]).toHaveProperty("sponsorName", "Test Sponsor");
  expect(responseBody.articles[0]).toHaveProperty("premium", false);

  console.log("\n✅ Custom fields successfully added to API response!");
  console.log("⚠️  Note: These fields are in the data but NOT displayed in UI (UI only shows standard fields)");

  // Verify articles are loaded in UI
  await expect(page.locator("app-article-list h1").first()).toBeVisible();
});
