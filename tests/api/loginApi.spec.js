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
    const setCookieHeader = response.headers.get("set-cookie");
    expect(response.status).toEqual(STATUS_CODES.SEE_OTHER);
    expect(setCookieHeader).toBeDefined();

    if (response.status === STATUS_CODES.SEE_OTHER) {
      expect(response.redirectLocation).toBeDefined();
    }
    expect(setCookieHeader).toMatch(/session|login|auth/i);
  });

  test("should fail login with invalid credentials", async () => {
    const invalidCredentials = {
      ...LOGIN_PAYLOAD,
      password: `${LOGIN_PAYLOAD.password}4`,
    };

    const response = await loginApi.login(invalidCredentials);

    expect(response.status).toEqual(STATUS_CODES.UNAUTHORIZED);
  });
});
