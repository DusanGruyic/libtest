import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pom/loginPage.js";
import { LOGIN_PAYLOAD } from "../../fixtures/constants/payloadData.js";

test.describe("Open Library Login Tests", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("https://openlibrary.org/");
    await page.waitForLoadState("networkidle");
  });

  test("should successfully log in with valid credentials", async () => {
    await loginPage.navigateToLogin();
    await loginPage.login({ payload: LOGIN_PAYLOAD });
  });

  test("should show error message for invalid email", async () => {
    await loginPage.loginWithInvalidCredentials(
      "invalid@example.com",
      LOGIN_PAYLOAD.password
    );
  });

  test("should show error message for invalid password", async () => {
    await loginPage.loginWithInvalidCredentials(
      LOGIN_PAYLOAD.email,
      "wrongpassword"
    );
  });

  test("should log in with leading space in email", async () => {
    await loginPage.navigateToLogin();
    await loginPage.login({
      expectSuccess: true,
      payload: {
        ...LOGIN_PAYLOAD,
        email: ` ${LOGIN_PAYLOAD.email}`,
      },
    });
  });

  test("should log in with trailing space in email", async () => {
    await loginPage.navigateToLogin();
    await loginPage.login({
      expectSuccess: true,
      payload: {
        ...LOGIN_PAYLOAD,
        email: `${LOGIN_PAYLOAD.email} `,
      },
    });
  });
});
