import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutsPage } from "../page-objects/formLayoutsPage";
import { DatePickerPage } from "../page-objects/datepickerPage";

test.beforeEach(async ({ page }) => {
  // url from .env file
  // await page.goto(process.env.URL_5usePOM);
    await page.goto("http://localhost:4200");
});

test("Navigate to form page", async ({ page }) => {
  const navigationPage = new NavigationPage(page);

  await navigationPage.formLayoutsPage();
  await navigationPage.datePickerPage();
  await navigationPage.smartTablePage();
  await navigationPage.toastrPage();
  await navigationPage.tooltipPage();
});

test("Parametrized methods", async ({ page }) => {
  const navigationPage = new NavigationPage(page);
  const formLayoutsPage = new FormLayoutsPage(page);
  const datePickerPage = new DatePickerPage(page);

  await navigationPage.formLayoutsPage();
  await formLayoutsPage.submitUsingGridFormWithCredentialsAndSelectOption("test@test.com", "welcome", "Option 2");

  await formLayoutsPage.submitInlineFormWithNameEmailAndCheckbox("John Smith", "jong@test.com", true);
  await navigationPage.datePickerPage();
  await datePickerPage.selectCommonDatePickerDateFromToday(10);
  await datePickerPage.selectDatepickerWithRangeFromToday(6, 15);
});
