export const LOGIN_PAYLOAD = {
  email: "dusan.grujic@automaticity.rs",
  password: "testopenlib123",
};

export const INVALID_CREDENTIALS = {
  invalidEmail: "invalid@example.com",
  invalidPassword: "wrongpassword",
  emptyEmail: "",
  emptyPassword: "",
  malformedEmail: "notanemail",
  shortPassword: "123",
};

export const TEST_DATA = {
  validUser: LOGIN_PAYLOAD,
  invalidUser: INVALID_CREDENTIALS,
};
