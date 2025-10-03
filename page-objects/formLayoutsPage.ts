import { Page } from "@playwright/test";

export class FormLayoutsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async submitUsingGridFormWithCredentialsAndSelectOption(
    email: string,
    password: string,
    optionText: string,
  ) {
    const usingGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    await usingGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingGridForm
      .getByRole("textbox", { name: "Password" })
      .fill(password);
    await usingGridForm
      .getByRole("radio", { name: optionText })
      .check({ force: true });
    await usingGridForm.locator("[data-testid='SignIn']").click();
  }
  
  /**
   * This method fill in Inline form with User details
   * @param name - first and last name
   * @param email - valid email
   * @param rememberMe - true or false
   */
  async submitInlineFormWithNameEmailAndCheckbox(
    name: string,
    email: string,
    rememberMe: boolean,
  ) {
    const inlineForm = this.page.locator("nb-card", {
      hasText: "Inline form",
    });
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);
    if (rememberMe) {
      await inlineForm.getByRole("checkbox").check({ force: true });
      await inlineForm.getByRole("button", { name: "Submit" }).click();
    }
  }
}
