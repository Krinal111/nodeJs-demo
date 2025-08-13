// services/authService.js
const axios = require("axios");

let accessToken = null;
let refreshToken = null;
let tokenExpiry = null;

const BASE_URL = process.env.POLLUTION_BASE_URL;
const USERNAME = process.env.POLLUTION_USER;
const PASSWORD = process.env.POLLUTION_PASS;

async function login() {
  const { data } = await axios.post(`${BASE_URL}/auth/login`, {
    username: USERNAME,
    password: PASSWORD,
  });

  accessToken = data.token;
  refreshToken = data.refreshToken;
  tokenExpiry = Date.now() + 60 * 1000;
  console.log("accessToken", data);
  return accessToken;
}

async function refresh() {
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
    refreshToken,
  });

  accessToken = data.token;
  tokenExpiry = Date.now() + 60 * 1000;
  console.log("accessToken", accessToken);
  return accessToken;
}

async function getToken() {
  if (!accessToken || Date.now() >= tokenExpiry) {
    if (!refreshToken) {
      return await login();
    }
    return await refresh();
  }
  return accessToken;
}

module.exports = { getToken };
