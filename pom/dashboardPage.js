import { expect } from "@playwright/test";
import { stat } from "fs";

export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.openLibLogo = page.locator(".logo-component img");
    this.welcomeMessage = page.locator(
      "//h2[normalize-space()='Welcome to Open Library']"
    );
    this.myBooksLink = page.locator(
      "ul[class='navigation-component'] div[class='mybooks-component header-dropdown'] a"
    );
    this.hamburgerIcon = page.locator(".hamburger__icon.logged");
    this.logoutButton = page.getByRole("button", { name: "Log out" });
    this.locateButton = page.locator('[data-ol-link-track="CTAClick|Locate"]');
    this.readButton = page.locator(
      'a[title="Read free online from Standard Ebooks"]:has-text("Read")'
    );
    this.borrowButton = page
      .locator(".cta-btn.cta-btn--ia.cta-btn--available.cta-btn--borrow")
      .first();
    this.searchInput = page.locator("input[placeholder='Search']");
    this.bookDescription = page.locator(".book-desc").first();
  }
  async navigateToMyBooks() {
    await this.myBooksLink.click();
    await expect(this.page).toHaveURL(/.*\/people\/libtest\d+\/books/);
  }

  async readBookFromCarousel(bookTitle) {
    let dynamicBookLocator = this.page
      .locator(
        `div[class*='book carousel__item']:has(a > img[title='${bookTitle}']) a:has-text('Read')`
      )
      .first();

    if (!(await dynamicBookLocator.isVisible())) {
      dynamicBookLocator = this.page
        .locator(
          `div[class*='book carousel__item']:has(a > img[title='${bookTitle}']) a:has-text('Borrow')`
        )
        .first();
    }
    await expect(dynamicBookLocator).toBeVisible();
    await dynamicBookLocator.click();
  }

  async searchForBook(bookName) {
    await this.searchInput.click();
    await this.searchInput.fill(bookName);
    await expect(this.bookDescription).toBeVisible();
    const dropdownOption = this.page
      .locator(`a:has-text('${bookName}')`)
      .first();

    await dropdownOption.click();
  }
}
