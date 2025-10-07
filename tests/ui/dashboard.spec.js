import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pom/loginPage.js";
import { DashboardPage } from "../../pom/dashboardPage.js";

test.describe("Dashboard Accessibility Tests", () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto("https://openlibrary.org/");
    await loginPage.navigateToLogin();
    await loginPage.login({});
    await loginPage.verifyLoginCookie();

    await page.waitForLoadState("networkidle");
  });

  test("should make dashboard accessible when logged in", async ({ page }) => {
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.hamburgerIcon).toBeVisible();

    await dashboardPage.navigateToMyBooks();
  });

  test("should search for a book and navigate to its page", async ({
    page,
  }) => {
    const bookTitle = "The Hobbit";
    await dashboardPage.searchForBook(bookTitle);

    await expect(page).toHaveURL(/.*\/works\/.*/);
  });

  test("should search for a book and read it if available", async ({
    page,
  }) => {
    const bookTitle = "Lord Jim";
    await dashboardPage.searchForBook(bookTitle);

    await expect(page).toHaveURL(/.*\/works\/.*/);

    const canRead = await dashboardPage.readBook(bookTitle);

    if (canRead.success) {
      await canRead.readingPage.waitForTimeout(5000);
    } else {
      console.log(`Read option not available for ${bookTitle}`);
    }
  });

  test("should fail when trying to read unavailable book", async ({ page }) => {
    const bookTitle = "Pride & Prejudice";

    await dashboardPage.searchForBook(bookTitle);
    await expect(page).toHaveURL(/.*\/works\/.*/);

    const canRead = await dashboardPage.readBook(bookTitle);

    await expect(canRead.success).toBe(false);
    await expect(canRead.readingPage).toBeNull();
  });

  test("should show error message when searching for non-existent book", async ({}) => {
    const nonExistentBook = "Xasdajsdqiw";

    await dashboardPage.searchForBook(nonExistentBook);

    await expect(dashboardPage.errorMessage).toBeVisible();
  });

  test.only("should successfully borrow a book if available", async ({
    page,
  }) => {
    const bookTitle = "The Great Gatsby";

    await dashboardPage.searchForBook(bookTitle);
    await expect(page).toHaveURL(/.*\/works\/.*/);

    const borrowResult = await dashboardPage.borrowBook();

    if (borrowResult.success) {
      expect(borrowResult.borrowResponse.status()).toEqual(301);

      await expect(page).toHaveURL(/.*archive\.org\/details\/.*/);
    }
  });

  test("should fail to borrow a book if borrow option not available", async ({
    page,
  }) => {
    const bookTitle = "To the Lighthouse";

    await dashboardPage.searchForBook(bookTitle);

    const borrowResult = await dashboardPage.borrowBook();

    await expect(borrowResult.success).toBe(false);
    await expect(borrowResult.borrowResponse).toBeNull();
  });
});
