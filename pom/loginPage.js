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

  async fillCredentials({ payload }) {
    await this.usernameInput.fill(payload.email);

    await expect(await this.usernameInput).toHaveValue(payload.email);

    await this.passwordInput.fill(payload.password);

    await expect(this.passwordInput).toHaveValue(payload.password);
  }

  async navigateToLogin() {
    await this.loginLink.click();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async login({ payload = LOGIN_PAYLOAD }) {
    const responsePromise = this.page.waitForResponse("**/account/login");
    await this.usernameInput.fill(payload.email);
    await this.passwordInput.fill(payload.password);
    await this.loginButton.click();

    const response = await responsePromise;
    expect(await response.status()).toEqual(303);
  }

  async loginWithInvalidCredentials(email, password) {
    await this.navigateToLogin();
    await this.usernameInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await expect(this.errorMessage).toBeVisible();
  }
}
