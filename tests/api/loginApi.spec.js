import { test, expect } from "@playwright/test";
import { STATUS_CODES } from "../../fixtures/constants/http.js";
import { LOGIN_PAYLOAD } from "../../fixtures/constants/payloadData.js";
import { LoginApi } from "../../modules/api/loginApi.js";

test.describe("Login API", () => {
  let loginApi;

  test.beforeAll(() => {
    loginApi = new LoginApi();
  });

  test("should login with valid credentials", async ({ request }) => {
    const response = await loginApi.login(LOGIN_PAYLOAD, request);
    expect(response.responseHeaders["set-cookie"]).toContain(
      "session=/people/libtest"
    );
    const cookieValue = response.responseHeaders["set-cookie"];
    const datePattern = /\d{4}-\d{2}-\d{2}/;
    const dateMatch = cookieValue.match(datePattern);

    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];

    expect(dateMatch[0]).toBe(currentDate);
  });

  test("should fail login with invalid credentials", async ({ request }) => {
    const invalidCredentials = {
      ...LOGIN_PAYLOAD,
      password: `${LOGIN_PAYLOAD.password}4`,
    };

    const response = await loginApi.login(invalidCredentials, request);

    expect(response.status).toEqual(STATUS_CODES.OK);
  });
});
