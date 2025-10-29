import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
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
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(100)}@test.com`;

  await pm.navigateTo().formLayoutsPage();
  await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption("test3@test.com", "welcome", "Option 2");
  await page.screenshot({ path: "screenshots/formLayoutsPage.png" });
  page.locator("nb-card", { hasText: "Inline form" }).screenshot({ path: "screenshots/inlineForm.png" });

  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);
  await page.screenshot({ path: "screenshots/EmailAndCheckbox.png" });

  await pm.navigateTo().datePickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(7);
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(8, 13);
  await page.screenshot({ path: "screenshots/datePickerPage.png" });
});
