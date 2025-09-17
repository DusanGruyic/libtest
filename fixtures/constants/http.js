export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  SEE_OTHER: 303,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  BAD_METHOD: 405,
  NOT_ACCEPTABLE: 406,
  BAD_REQUEST: 400,
  BAD_ENTITY: 422,
  SERVER_ERROR: 500,
};

export const METHODS = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  HEAD: "head",
};

const baseEndopoint = "https://openlibrary.org/";

export const ENDPOINTS = {
  baseEndopoint,
  LOGIN: `${baseEndopoint}/account/login`,
  PROFILE: `${baseEndopoint}/people`,
};

export default { STATUS_CODES, METHODS, ENDPOINTS };
