import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntax rules, ID, Class, Attribete, ..", async ({ page }) => {
  // locator by Tag name
  await page.locator("input").first().click();

  // locator by ID
  page.locator("#inputEmail1");

  // locator by Class
  page.locator(".shape-rectangle");

  // locator by Attribute
  page.locator("[placeholder='Email']");

  // locator by Class value (full class value)
  page.locator(
    "[class='input-full-width size-medium status-basic shape-rectangle nb-transition']",
  );

  // combine different selectors e.x. Tag + Attribute + Class
  // locators by Xpath (not recommended)
  page.locator("//*[id='inputEmail1']");

  // locators by partial text match
  page.locator(":text('Using')");

  // locators by exact test match
  page.locator(":text-is('Using the Grid')");
});

test("User facing locators (getByRole, getByLabel, getByPlaceholder, getByText, getByTitle, getByTestId)", async ({
  page,
}) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").click();

  await page.getByText("Using the Grid").click();

  await page.getByTitle("IoT Dashboard").click();

  await page.getByTestId("SignIn").click();
});

test("Locating child elements", async ({ page }) => {
  await page.locator("nb-card nb-radio :text-is('Option 1')").click(); // 1 variant
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(":text-is('Option 2')")
    .click(); // 2 variant

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign In" })
    .first()
    .click();

  await page.locator("nb-card").nth(3).getByRole("button").click(); // nth - index of element
});

test("Locating parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign In" })
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing the locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });

  await emailField.fill("test@test.com");
  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("Extracting text values", async ({ page }) => {
  // single test value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent(); // grab text from button will be assigned to buttonText
  expect(buttonText).toEqual("Submit");

  // all text values
  const allRadioButtonLabels = await page.locator("nb-radio").allTextContents(); // grab all t ext elements
  expect(allRadioButtonLabels).toContain("Option 1");

  // input values
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue(); // grab input value from email field
  expect(emailValue).toEqual("test@test.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});

test("Assertions", async ({ page }) => {
  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .locator("button");

  // General assertions
  const value = 5;
  expect(value).toEqual(5);

  const text = await basicFormButton.textContent();
  expect(text).toEqual("Submit");

  // Locator assertions
  await expect(basicFormButton).toHaveText("Submit");

  // Soft assertions
  await expect.soft(basicFormButton).toHaveText("Submit");
  await basicFormButton.click();
});
