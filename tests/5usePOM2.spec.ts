import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test("Navigate to form page", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("Parametrized methods", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption("test@test.com", "welcome", "Option 2");
  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox("John Smith", "jong@test.com", true);
  await pm.navigateTo().datePickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(7);
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(8, 13);
});
