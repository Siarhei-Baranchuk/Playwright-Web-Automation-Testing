import { test, expect } from "@playwright/test";

test("Drag and Drop with Iframe", async ({ page }) => {
  await page.goto("https://www.globalsqa.com/demo-site/draganddrop/");

  // Close cookie consent popup
  const consentButton = page.getByRole("button", { name: "Consent" });
  if (await consentButton.isVisible({ timeout: 2000 })) {
    await consentButton.click();
  }

  // Wait for iframe to load
  const frame = page.frameLocator('iframe[src*="photo-manager"]');

  await frame.locator("h5.ui-widget-header", { hasText: "High Tatras 2" }).dragTo(frame.locator("#trash", { hasText: "Trash" }));

  // more presice control
  await frame.locator("li", { hasText: "High Tatras 4" }).hover();
  await page.mouse.down();
  await frame.locator("#trash").hover();
  await page.mouse.up();

  await expect(frame.locator("#trash li h5")).toHaveText(["High Tatras 2", "High Tatras 4"]);
});
