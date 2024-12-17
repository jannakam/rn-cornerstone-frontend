import axios from "axios";
import { getToken } from "./storage";

const instance = axios.create({

  baseURL: "http://192.168.8.25:8082/api",

});

// Add request interceptor to automatically add token to all requests
instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Response:", error.response?.data);
    return Promise.reject(error);
  }
);

export default instance;
