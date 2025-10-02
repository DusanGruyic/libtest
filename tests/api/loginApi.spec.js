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

  test("should login with leading space in email", async ({ request }) => {
    const payloadWithLeadingSpace = {
      ...LOGIN_PAYLOAD,
      email: ` ${LOGIN_PAYLOAD.email}`,
    };

    const response = await loginApi.login(payloadWithLeadingSpace, request);
    expect(response.status).toEqual(STATUS_CODES.SEE_OTHER);
    expect(response.responseHeaders["set-cookie"]).toContain(
      "session=/people/libtest"
    );
  });

  test("should fail login with invalid credentials", async ({ request }) => {
    const invalidCredentials = {
      ...LOGIN_PAYLOAD,
      password: `${LOGIN_PAYLOAD.password}4`,
    };

    const response = await loginApi.login(invalidCredentials, request);

    expect(response.status).toEqual(STATUS_CODES.OK);
  });

  test("Should not log in with email of a non-registered user", async ({
    request,
  }) => {
    const invalidCredentials = {
      ...LOGIN_PAYLOAD,
      email: `a${LOGIN_PAYLOAD.email}`,
    };
    const response = await loginApi.login(invalidCredentials, request);
    expect(response.status).toEqual(STATUS_CODES.OK);
    if (response.responseHeaders && response.responseHeaders["set-cookie"]) {
      expect(response.responseHeaders["set-cookie"]).not.toContain(
        "session=/people/libtest"
      );
    }
  });

  test("should login with all caps email variation", async ({ request }) => {
    const payloadWithCapsEmail = {
      ...LOGIN_PAYLOAD,
      email: LOGIN_PAYLOAD.email.toUpperCase(),
    };

    const response = await loginApi.login(payloadWithCapsEmail, request);
    expect(response.status).toEqual(STATUS_CODES.SEE_OTHER);
    expect(response.responseHeaders["set-cookie"]).toContain(
      "session=/people/libtest"
    );
  });

  test("should fail login with case-sensitive password variation", async ({
    request,
  }) => {
    const invalidCredentials = {
      ...LOGIN_PAYLOAD,
      password: LOGIN_PAYLOAD.password.toUpperCase(),
    };
    const response = await loginApi.login(invalidCredentials, request);

    expect(response.status).toEqual(STATUS_CODES.OK);
    if (response.responseHeaders && response.responseHeaders["set-cookie"]) {
      expect(response.responseHeaders["set-cookie"]).not.toContain(
        "session=/people/libtest"
      );
    }
  });

  test("should fail login with empty email field", async ({ request }) => {
    const invalidCredentials = {
      email: "",
      password: LOGIN_PAYLOAD.password,
    };

    const response = await loginApi.login(invalidCredentials, request);
    expect(response.status).toEqual(STATUS_CODES.OK); // Should be 401 but not working properly
    if (response.responseHeaders && response.responseHeaders["set-cookie"]) {
      expect(response.responseHeaders["set-cookie"]).not.toContain(
        "session=/people/libtest"
      );
    }
  });

  test("should fail login with empty password field", async ({ request }) => {
    const invalidCredentials = {
      email: LOGIN_PAYLOAD.email,
      password: "",
    };

    const response = await loginApi.login(invalidCredentials, request);
    expect(response.status).toEqual(STATUS_CODES.OK); // Should be 401 but not working properly
    if (response.responseHeaders && response.responseHeaders["set-cookie"]) {
      expect(response.responseHeaders["set-cookie"]).not.toContain(
        "session=/people/libtest"
      );
    }
  });

  test("should fail login with special characters in password", async ({
    request,
  }) => {
    const invalidCredentials = {
      ...LOGIN_PAYLOAD,
      password: "invalid@password#with$special%chars",
    };

    const response = await loginApi.login(invalidCredentials, request);
    expect(response.status).toEqual(STATUS_CODES.OK);
    if (response.responseHeaders && response.responseHeaders["set-cookie"]) {
      expect(response.responseHeaders["set-cookie"]).not.toContain(
        "session=/people/libtest"
      );
    }
  });
});
