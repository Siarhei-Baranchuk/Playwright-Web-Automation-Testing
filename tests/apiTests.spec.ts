import { test, expect } from "@playwright/test";
import { getAccessToken } from "../helpers/auth.helper";
import testData from "../test-data/testData.json";

let accessToken: string;

test.beforeAll(async ({ request }) => {
  accessToken = await getAccessToken(request);
});

test("Create Article", async ({ request }) => {
  // Prepare article data with unique title (to avoid conflicts)
  const timestamp = Date.now();
  const testArticleData = {
    title: `${testData.articles.createArticle.title} ${timestamp}`,
    description: testData.articles.createArticle.description,
    body: testData.articles.createArticle.body,
    tagList: testData.articles.createArticle.tagList,
  };

  // Create article
  const responseArticle = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
    data: {
      article: testArticleData,
    },
    headers: {
      authorization: `Token ${accessToken}`,
    },
  });

  const responseBodyArticle = await responseArticle.json();

  // ===== HTTP RESPONSE VALIDATION =====
  expect(responseArticle.status()).toBe(201); // Created
  expect(responseArticle.status()).toEqual(201); // Created
  expect(responseArticle.ok()).toBeTruthy();

  // ===== RESPONSE STRUCTURE VALIDATION =====
  expect(responseBodyArticle).toHaveProperty("article");
  expect(responseBodyArticle.article).toBeDefined();
  expect(responseBodyArticle.article).not.toBeNull();

  // ===== ARTICLE FIELDS VALIDATION =====
  const article = responseBodyArticle.article;

  // 1. Title validation
  expect(article).toHaveProperty("title");
  expect(article.title).toBe(testArticleData.title);
  expect(typeof article.title).toBe("string");
  expect(article.title.length).toBeGreaterThan(0);

  // 2. Description validation
  expect(article).toHaveProperty("description");
  expect(article.description).toBe(testArticleData.description);
  expect(typeof article.description).toBe("string");

  // 3. Body validation
  expect(article).toHaveProperty("body");
  expect(article.body).toBe(testArticleData.body);
  expect(typeof article.body).toBe("string");
  expect(article.body.length).toBeGreaterThan(0);

  // 4. TagList validation
  expect(article).toHaveProperty("tagList");
  expect(Array.isArray(article.tagList)).toBeTruthy();
  expect(article.tagList.length).toBe(3);
  // Verify all sent tags are present
  expect(article.tagList).toContain("testing");
  expect(article.tagList).toContain("playwright");
  expect(article.tagList).toContain("automation");

  // 5. CreatedAt validation
  expect(article).toHaveProperty("createdAt");
  expect(typeof article.createdAt).toBe("string");

  // 6. UpdatedAt validation
  expect(article).toHaveProperty("updatedAt");
  expect(typeof article.updatedAt).toBe("string");

  // 7. Favorited validation (default values)
  expect(article).toHaveProperty("favorited");
  expect(article.favorited).toBe(false); // Not favorited by default

  // 8. FavoritesCount validation
  expect(article).toHaveProperty("favoritesCount");
  expect(typeof article.favoritesCount).toBe("number");
  expect(article.favoritesCount).toBe(0); // Zero favorites on creation
  expect(article.favoritesCount).toBeGreaterThanOrEqual(0);

  // ===== AUTHOR OBJECT VALIDATION =====
  expect(article).toHaveProperty("author");
  expect(article.author).toBeDefined();
  expect(article.author).not.toBeNull();
  expect(typeof article.author).toBe("object");

  const author = article.author;

  // 1. Username validation
  expect(author).toHaveProperty("username");
  expect(typeof author.username).toBe("string");
  expect(author.username).toBe("username45645654");
  expect(author.username.length).toBeGreaterThan(0);

  // 2. Bio validation
  expect(author).toHaveProperty("bio");
  // Bio can be null or string

  // 3. Image validation
  expect(author).toHaveProperty("image");
  if (author.image) {
    expect(typeof author.image).toBe("string");
  }

  // 4. Following validation
  expect(author).toHaveProperty("following");
  expect(typeof author.following).toBe("boolean");
  expect(author.following).toBe(false); // Not following yourself
});

test("Create Article - Duplicate title should fail", async ({ request }) => {
  // 1. Create first article
  const firstArticleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
    data: {
      article: testData.articles.duplicateArticle,
    },
    headers: {
      authorization: `Token ${accessToken}`,
    },
  });

  const firstArticleBody = await firstArticleResponse.json();

  // Verify first article was created successfully
  expect(firstArticleResponse.status()).toBe(201);
  expect(firstArticleBody).toHaveProperty("article");

  // 2. Try to create second article with same title (should fail)
  const duplicateResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
    data: {
      article: testData.articles.duplicateArticle, // Same title
    },
    headers: {
      authorization: `Token ${accessToken}`,
    },
  });

  const duplicateResponseBody = await duplicateResponse.json();

  // ===== VALIDATION: Duplicate should be rejected =====

  // 1. HTTP Status validation
  expect(duplicateResponse.status()).toBe(422); // Unprocessable Entity
  expect(duplicateResponse.ok()).toBe(false); // Not successful

  // 2. Response structure validation
  expect(duplicateResponseBody).toHaveProperty("errors");
  expect(duplicateResponseBody).not.toHaveProperty("article"); // Article was NOT created
  expect(duplicateResponseBody.errors).toBeDefined();

  // 3. Error message validation
  expect(duplicateResponseBody.errors).toHaveProperty("title");
  expect(duplicateResponseBody.errors.title).toContain("must be unique");

  // Cleanup: Delete the created article
  const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${firstArticleBody.article.slug}`, {
    headers: {
      authorization: `Token ${accessToken}`,
    },
  });
  expect(deleteResponse.status()).toBe(204); // No Content (successful deletion)
});

test("Create article via UI and delete via API", async ({ page, request }) => {
  // Set token in localStorage BEFORE page loads (no reload needed!)
  await page.addInitScript((token) => {
    localStorage.setItem("jwtToken", token);
  }, accessToken);

  // Navigate to page - token is already in localStorage
  await page.goto("https://conduit.bondaracademy.com/");

  // Click on New Article (now visible because user is authenticated)
  await page.getByText("New Article").click();

  // Fill article form with unique title
  const articleTitle = `Article Title of Playwright ${Date.now()}`;
  await page.getByRole("textbox", { name: "Article Title" }).fill(articleTitle);
  await page.getByRole("textbox", { name: "What's this article about?" }).fill("Test Article Description");
  await page.getByRole("textbox", { name: "Write your article (in markdown)" }).fill("My 1st Playwright article for automation");
  await page.getByRole("button", { name: "Publish Article" }).click();

  // Wait for API POST response when creating article
  const articleResponse = await page.waitForResponse((response) => response.url().includes("/api/articles") && response.request().method() === "POST");
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody.article.slug;

  // Verify article is created - check that h1 with article title is visible
  await expect(page.locator("h1")).toContainText(articleTitle);

  // Go to home page
  await page.getByText("Home").click();
  await page.getByText("Global Feed").click();

  // Verify article appears in the feed
  await expect(page.locator("app-article-list h1").first()).toContainText(articleTitle);

  // Delete article via API
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: `Token ${accessToken}`,
    },
  });

  // Verify deletion was successful
  expect(deleteArticleResponse.status()).toEqual(204);
});
