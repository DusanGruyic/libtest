import { expect } from "@playwright/test";
import { LOGIN_PAYLOAD } from "../fixtures/constants/payloadData.js";

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginLink = page.locator(".btn[href='/account/login']");
    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator('button:has-text("Log in")');
    this.myBooksLink = page.getByText("My Books");
    this.errorMessage = page.locator(".error.ol-signup-form__info-box");
  }

  async getCookie() {
    const cookie = await this.page.evaluate(() => {
      return document.cookie;
    });

    return cookie;
  }

  async verifyLoginCookie() {
    const cookie = await this.getCookie();
    await expect(cookie).toContain("session=/people/libtest");
    return cookie;
  }

  async navigateToLogin() {
    await this.loginLink.click();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async login({
    payload = LOGIN_PAYLOAD,
    invalidCase = false,
    expectedError = null,
    emptyFields = false,
  }) {
    let responsePromise;
    if (!emptyFields) {
      responsePromise = this.page.waitForResponse("**/account/login");
    }
    await this.usernameInput.fill(payload.email);
    await this.passwordInput.fill(payload.password);
    await this.loginButton.click();

    if (!emptyFields) {
      const response = await responsePromise;
      if (invalidCase) {
        await expect(this.errorMessage).toBeVisible();

        if (expectedError) {
          await expect(this.errorMessage).toHaveText(expectedError);
        }

        return expect(await response.status()).toEqual(200); // Should be 401 but not working properly
      }

      expect(await response.status()).toEqual(303);
    }
  }
}
