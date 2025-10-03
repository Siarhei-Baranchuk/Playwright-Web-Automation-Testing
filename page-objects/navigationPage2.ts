import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  // readonly page: Page;
  readonly formLayoutsMenuItem: Locator;
  readonly datePickerMenuItem: Locator;
  readonly smartTableMenuItem: Locator;
  readonly toastrMenuItem: Locator;
  readonly tooltipMenuItem: Locator;

  constructor(page: Page) {
    // this.page = page;
    super(page); // from HelperBase
    this.formLayoutsMenuItem = page.getByText("Form Layouts");
    this.datePickerMenuItem = page.getByText("Datepicker");
    this.smartTableMenuItem = page.getByText("Smart Table");
    this.toastrMenuItem = page.getByText("Toastr");
    this.tooltipMenuItem = page.getByText("Tooltip");
  }

  async formLayoutsPage() {
    //     await this.page.getByText("Forms").click();
    await this.selectGroupMunuItem("Forms");
    await this.formLayoutsMenuItem.click();
    await this.waitForNumberOfSeconds(3); // from HelperBase
  }

  async datePickerPage() {
    //     await this.page.getByText("Forms").click();
    await this.selectGroupMunuItem("Forms");
    await this.datePickerMenuItem.click();
  }

  async smartTablePage() {
    await this.page.getByText("Tables & Data").click();
    await this.smartTableMenuItem.click();
  }

  async toastrPage() {
    await this.page.getByText("Modal & Overlays").click();
    await this.toastrMenuItem.click();
  }

  async tooltipPage() {
    await this.page.getByText("Modal & Overlays").click();
    await this.tooltipMenuItem.click();
  }

  private async selectGroupMunuItem(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");
    if (expandedState == "false") {
      await groupMenuItem.click();
    }
  }
}
