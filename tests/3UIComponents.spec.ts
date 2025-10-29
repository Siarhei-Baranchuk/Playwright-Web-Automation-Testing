import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
});

test.describe("Form Layouts page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("Input fields", async ({ page }) => {
    const usingGridEmailInput = page.locator("nb-card", { hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" });

    await usingGridEmailInput.fill("test@test.com");
    await usingGridEmailInput.clear();
    await usingGridEmailInput.pressSequentially("test2@test.com");

    // generic assertions
    const inputValue = await usingGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    // locator assertion
    await expect(usingGridEmailInput).toHaveValue("test2@test.com");
  });

  test("Radio buttons", async ({ page }) => {
    const usingGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    await usingGridForm.getByLabel("Option 1").check({ force: true });
    await usingGridForm.getByRole("radio", { name: "Option 1" }).check({ force: true });

    expect(await usingGridForm.getByRole("radio", { name: "Option 1" }).isChecked()).toBeTruthy();

    await expect(usingGridForm.getByRole("radio", { name: "Option 1" })).toBeChecked();

    await usingGridForm.getByRole("radio", { name: "Option 2" }).check({ force: true });

    // Screenshot
    // await expect(usingGridForm).toHaveScreenshot()

    expect(await usingGridForm.getByRole("radio", { name: "Option 1" }).isChecked()).toBeFalsy();

    expect(await usingGridForm.getByRole("radio", { name: "Option 2" }).isChecked()).toBeTruthy();
  });
});

test("Checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  await page.getByRole("checkbox", { name: "Hide on click" }).uncheck({ force: true });

  await page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" }).check({ force: true });

  const allBoxes = page.getByRole("checkbox");
  for (const box of await allBoxes.all()) {
    await box.check({ force: true });
    expect(await box.isChecked()).toBeTruthy();
  }
});

test("Lists and Dropdown", async ({ page }) => {
  const dropDownMenu = page.locator("ngx-header nb-select");
  await dropDownMenu.click();

  await page.getByRole("list"); // when the list has UL tag
  await page.getByRole("listitem"); // when the list has LI tag

  // const optionList = page.getByRole("list").locator("nb-option");
  const optionList = page.locator("nb-option-list nb-option");

  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  await optionList.filter({ hasText: "Cosmic" }).click();

  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  const colors = {
    light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  await dropDownMenu.click();
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
    if (color != "Corporate") {
      await dropDownMenu.click();
    }
  }
});

test("Tooltips", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTipCard.getByRole("button", { name: "Top" }).hover();

  // page.getByRole("tooltip")   // works if you have a role tooltip created

  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("Dialog Box (from browser)", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  }); // listener - page.on, dialog - event

  await page.getByRole("table").locator("tr", { hasText: "mdo@gmail.com" }).locator(".nb-trash").click();

  await expect(page.locator("table tr").first()).not.toHaveText("mdo@gmail.com");
});

test("Web Tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1 get the row by any text in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("77");

  await page.locator(".nb-checkmark").click();
  await expect(targetRow.locator(".ng-star-inserted").getByText("77")).toHaveText("77");

  // 2 get the row based on the value in the specific column
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowById = page.getByRole("row", { name: "11" }).filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();

  await page.locator("input-editor").getByPlaceholder("E-mail").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").fill("test@test.com");

  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

  // 3 test filter of the table
  const ages = ["20", "30", "40", "200"];
  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500);

    const ageRows = page.locator("tbody tr");
    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent();

      if (age == "200") {
        expect(await page.getByRole("table").textContent()).toContain("No data found");
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test("Date Picker", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  await page.locator("[class='day-cell ng-star-inserted']").getByText("1", { exact: true }).click();
  await expect(calendarInputField).toHaveValue("Oct 1, 2025");
});

test("Date Picker 2", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 7);
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleDateString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleDateString("En-US", { month: "long" });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
  while (!calendarMonthAndYear.includes(expectedMonthLong)) {
    await page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']").click();
    calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
  }

  page.locator("[class='day-cell ng-star-inserted']").getByText(expectedDate, { exact: true }).click();
  await expect(calendarInputField).toHaveValue(dateToAssert);
});

test("Sliders - Update attribute", async ({ page }) => {
  // Update attribute
  const tempGauge = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger circle");
  await tempGauge.evaluate((node) => {
    node.setAttribute("cx", "232.630");
    node.setAttribute("cy", "232.630");
  });
  await tempGauge.click();
  await expect(page.locator("[class='value temperature h1']")).toContainText("30");
});

test("Sliders - Mouse movement", async ({ page }) => {
  // Mouse movement
  const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger");
  await tempBox.scrollIntoViewIfNeeded();

  const box = await tempBox.boundingBox();
  const x = (box.x = box.width / 2);
  const y = (box.y = box.height / 2);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 100, y);
  await page.mouse.move(x + 100, y + 900);
  await page.mouse.up();
  await expect(tempBox).toContainText("24");
});

test("Screenshots", async ({ page }) => {
  const pm = new PageManager(page);
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(100)}@test.com`;

  await pm.navigateTo().formLayoutsPage();
  await pm.onFormLayoutsPage().submitUsingGridFormWithCredentialsAndSelectOption("test3@test.com", "welcome", "Option 2");

  // screenshot of full page
  await page.screenshot({ path: "screenshots/formLayoutsPage.png" });
  // screenshot of specific element
  page.locator("nb-card", { hasText: "Inline form" }).screenshot({ path: "screenshots/inlineForm.png" });

  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);

  // screenshot of full page
  await page.screenshot({ path: "screenshots/EmailAndCheckbox.png" });

  await pm.navigateTo().datePickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(7);
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(8, 13);

  // screenshot of full page
  await page.screenshot({ path: "screenshots/datePickerPage.png" });
});
