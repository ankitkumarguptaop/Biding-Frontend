import axios from "axios";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const storage = createWebStorage("local");
      const persistedData = await storage.getItem("persist:root");

      if (persistedData) {
        const parsed = JSON.parse(persistedData);
        const userState = parsed.user ? JSON.parse(parsed.user) : null;
        const token = userState?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error getting token from storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
