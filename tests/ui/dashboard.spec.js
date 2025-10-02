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
    await page.waitForLoadState("networkidle");
    await loginPage.navigateToLogin();
    await loginPage.login({});
    await loginPage.verifyLoginCookie();
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
    await expect(page.locator("h1")).toContainText(bookTitle);
  });
});
