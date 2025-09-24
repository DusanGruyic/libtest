import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pom/loginPage.js";
import { LOGIN_PAYLOAD } from "../../fixtures/constants/payloadData.js";
import errorMessages from "../../fixtures/data/errorMessages.json";

test.describe("Open Library Login Tests", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await page.goto("https://openlibrary.org/");
    await page.waitForLoadState("networkidle");
    await loginPage.navigateToLogin();
  });

  test("should successfully log in with valid credentials", async () => {
    await loginPage.login({ payload: LOGIN_PAYLOAD });
    await loginPage.verifyLoginCookie();
  });

  test("should show error message for invalid email", async () => {
    await loginPage.login({
      payload: {
        ...LOGIN_PAYLOAD,
        email: "invalid@example.com",
      },
      invalidCase: true,
      expectedError: errorMessages.invalidEmail,
    });
  });

  test("should show error message for invalid password", async () => {
    await loginPage.login({
      payload: {
        ...LOGIN_PAYLOAD,
        password: "invalidpassword",
      },
      invalidCase: true,
      expectedError: errorMessages.invalidPassword,
    });
  });

  test("should log in with leading space in email", async () => {
    await loginPage.login({
      payload: {
        ...LOGIN_PAYLOAD,
        email: ` ${LOGIN_PAYLOAD.email}`,
      },
    });
  });

  test("should log in with trailing space in email", async () => {
    await loginPage.login({
      payload: {
        ...LOGIN_PAYLOAD,
        email: `${LOGIN_PAYLOAD.email} `,
      },
    });
  });

  test("should log in with all caps email variation", async () => {
    await loginPage.login({
      payload: {
        email: LOGIN_PAYLOAD.email.toUpperCase(),
        password: LOGIN_PAYLOAD.password,
      },
    });
  });

  test("should show error for case-sensitive password variation", async () => {
    await loginPage.login({
      payload: {
        email: LOGIN_PAYLOAD.email,
        password: LOGIN_PAYLOAD.password.toUpperCase(),
      },
      invalidCase: true,
      expectedError: errorMessages.invalidPassword,
    });
  });

  test("should handle special characters in invalid password", async () => {
    await loginPage.login({
      payload: {
        email: LOGIN_PAYLOAD.email,
        password: "invalid@password#with$special%chars",
      },
      invalidCase: true,
      expectedError: errorMessages.invalidPassword,
    });
  });

  test.only("should not log in with non existent credentials", async () => {
    await loginPage.login({
      payload: {
        email: "12123123@gmail.com",
        password: "randompassword123",
      },
      invalidCase: true,
      expectedError: errorMessages.nonExistentAccount,
    });
  });

  test("should handle excessively long email input", async () => {
    const longEmail = "a".repeat(300) + "@example.com";
    await loginPage.login({
      payload: {
        email: longEmail,
        password: LOGIN_PAYLOAD.password,
      },
      invalidCase: true,
      expectedError: errorMessages.invalidEmail,
    });
  });

  test("should not redirect with empty password field", async () => {
    const currentUrl = loginPage.page.url();
    await loginPage.login({
      payload: {
        ...LOGIN_PAYLOAD,
        password: "",
      },
      emptyFields: true,
    });
    expect(loginPage.page.url()).toBe(currentUrl);
  });

  test("should not redirect with empty email field", async () => {
    const currentUrl = loginPage.page.url();
    await loginPage.login({
      payload: {
        ...LOGIN_PAYLOAD,
        email: "",
      },
      emptyFields: true,
    });

    expect(loginPage.page.url()).toBe(currentUrl);
  });
});
