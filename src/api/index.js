import axios from "axios";
import { getToken } from "./storage";

const instance = axios.create({
  baseURL: "http://10.0.2.2:8083/api",
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    console.log("HEADERS: ", token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
