import { LOGIN_PAYLOAD } from "../../fixtures/constants/payloadData.js";

const env = {
  baseURl: "https://openlibrary.org",
};

export class LoginApi {
  async login(credentials = LOGIN_PAYLOAD, request) {
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);
    formData.append("secret", "");
    formData.append("access", "");
    formData.append("redirect", "https://openlibrary.org/");
    formData.append("action", "");
    formData.append("debug_token", "");

    const response = await request.post(`${env.baseURl}/account/login`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: `${env.baseURl}/account/login`,
        Origin: `${env.baseURl}`,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-GB,en;q=0.9",
        "Cache-Control": "max-age=0",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      data: formData.toString(),
      // Don't follow redirects automatically - we want to see the response
      maxRedirects: 0,
    });

    const responseHeaders = response.headers();
    console.log("Response headers:", responseHeaders);

    return {
      status: response.status(),
      responseHeaders,
    };
  }
}
