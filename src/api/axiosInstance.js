const axios = require("axios");
const { getToken } = require("../services/authService");

const axiosInstance = axios.create({
  baseURL: process.env.POLLUTION_BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken();
  console.log("token", token);
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

module.exports = axiosInstance;
