import { test, expect } from "@playwright/test";
import { STATUS_CODES } from "../../fixtures/constants/http.js";
import { LOGIN_PAYLOAD } from "../../fixtures/constants/payloadData.js";
import { LoginApi } from "../../modules/api/loginApi.js";

test.describe("Login API", () => {
  let loginApi;

  test.beforeAll(() => {
    loginApi = new LoginApi();
  });

  test("should login with valid credentials", async () => {
    const response = await loginApi.login(LOGIN_PAYLOAD);

    expect([STATUS_CODES.SEE_OTHER, STATUS_CODES.OK]).toContain(
      response.status
    );

    if (response.status === STATUS_CODES.SEE_OTHER) {
      expect(response.redirectLocation).toBeDefined();
    }

    expect(response.isHtml).toBe(true);
    expect(response.data).toContain("Classic Books");
  });

  test("should return session cookies on successful login", async () => {
    const response = await loginApi.login(LOGIN_PAYLOAD);

    const setCookieHeader = response.headers.get("set-cookie");
    expect(setCookieHeader).toBeDefined();

    expect(setCookieHeader).toMatch(/session|login|auth/i);
  });
});
