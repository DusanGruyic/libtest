import { LOGIN_PAYLOAD } from "../../fixtures/constants/payloadData.js";
import { ENDPOINTS, METHODS } from "../../fixtures/constants/http.js";

export class LoginApi {
  async login(credentials = LOGIN_PAYLOAD) {
    const loginPageResponse = await fetch(ENDPOINTS.LOGIN, {
      method: METHODS.GET,
    });

    const loginPageHtml = await loginPageResponse.text();

    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: METHODS.POST,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: ENDPOINTS.LOGIN,
      },
      body: formData,
      redirect: "manual",
    });

    const responseText = await response.text();
    const isHtmlResponse =
      responseText.includes("<html") || responseText.includes("<!DOCTYPE");

    return {
      status: response.status,
      headers: response.headers,
      data: isHtmlResponse
        ? responseText
        : await response.json().catch(() => null),
      isHtml: isHtmlResponse,
      redirectLocation: response.headers.get("location"),
    };
  }
}
