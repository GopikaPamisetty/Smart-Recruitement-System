// export const USER_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/user";
// // export const USER_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/user";
// export const JOB_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/job";
// export const APPLICATION_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/application";
// export const USER_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/user";
// export const COMPANY_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/company";
// export const JOB_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/job";
// export const APPLICATION_API_END_POINT = import.meta.env.VITE_API_URL + "/api/v1/application";
// src/utils/constant.js

// Base URL for API, populated from environment variable at build time
const BASE = import.meta.env.VITE_API_URL;

// User endpoints
export const USER_API_END_POINT = `${BASE}/api/v1/user`;

// Company endpoints
export const COMPANY_API_END_POINT = `${BASE}/api/v1/company`;

// Job endpoints
export const JOB_API_END_POINT = `${BASE}/api/v1/job`;

// Application endpoints
export const APPLICATION_API_END_POINT = `${BASE}/api/v1/application`;

