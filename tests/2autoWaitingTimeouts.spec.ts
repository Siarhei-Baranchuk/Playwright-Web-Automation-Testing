import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  //   await successButton.click();

  // wait for element
  await page.waitForSelector(".bg-success");

  // wait for particular response
  await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  await page.waitForLoadState("networkidle"); // state?: "load" | "domcontentloaded" | "networkidle"

  const text = await successButton.textContent();
  expect(text).toEqual("Data loaded with AJAX get request.");
});

test("timeouts", async ({ page }) => {
  const successButton = page.locator(".bg-success");
  await successButton.click();
});
