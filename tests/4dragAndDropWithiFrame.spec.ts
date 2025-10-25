import { test, expect } from "@playwright/test";

test("Drag and Drop with Iframe", async ({ page }) => {
  await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

  const frame = page.frameLocator("[rel-title='Photo Manager'] iframe");

  await frame.locator("li", { hasText: "Hight Tatras 2" }).dragTo(frame.locator("#trash"));

  // more presice control
  await frame.locator("li", { hasText: "Hight Tatras 4" }).hover();
  await page.mouse.down();
  await frame.locator("#trash").hover();
  await page.mouse.up();

  await expect(frame.locator("#trash li h5")).toHaveText(["Hight Tatras 2", "Hight Tatras 4"]);
});
