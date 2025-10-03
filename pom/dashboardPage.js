import { expect } from "@playwright/test";

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
    this.readButton = page
      .locator(
        'a[title="Read free online from Standard Ebooks"]:has-text("Read")'
      )
      .first();
    this.borrowButton = page
      .locator(".cta-btn.cta-btn--ia.cta-btn--available.cta-btn--borrow")
      .first();
    this.searchInput = page.locator("input[placeholder='Search']");
    this.bookDescription = page.locator(".book-desc").first();
    this.workTitle = page.locator(".work-title").first();
    this.bookCarousel = page.locator(".carousel");
    this.tableOfContents = page.locator("#toc");
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
    await expect(this.searchInput).toHaveValue(bookName);

    await this.bookDescription.waitFor({ state: "visible", timeout: 5000 });

    const dropdownOption = this.page
      .locator(`a:has-text('${bookName}')`)
      .first();

    await dropdownOption.click();
    await expect(this.workTitle).toHaveText(bookName);
  }

  async readBook(bookTitle) {
    const isReadButtonVisible = await this.readButton.isVisible();

    if (isReadButtonVisible) {
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent("page"),
        this.readButton.click(),
      ]);

      const bookSlug = bookTitle
        .replace(/\s+/g, "[_-]")
        .replace(/\s+and\s+/gi, "[_-](and|&)[_-]");
      await expect(newPage).toHaveURL(new RegExp(`.*${bookSlug}.*`));

      await newPage.waitForTimeout(5000);
      const tableOfContentsOnNewPage = newPage.locator("#toc");
      await expect(tableOfContentsOnNewPage).toBeVisible();

      return { success: true, readingPage: newPage };
    } else {
      console.log("Read option is not available for this book");
      return { success: false, readingPage: null };
    }
  }
}
