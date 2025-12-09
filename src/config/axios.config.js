import axios from "axios";
import { auth } from "./firebase.config";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get current Firebase user and their ID token
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ Error getting auth token:", error);
      }
      return Promise.reject(error);
    }
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("❌ Request interceptor error:", error);
    }
    return Promise.reject(error);
  }
); // Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response.data;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          if (import.meta.env.DEV) {
            console.error("❌ 401 Unauthorized - Invalid or expired token");
          }
          // You can add logic here to redirect to login or refresh token
          break;

        case 403:
          if (import.meta.env.DEV) {
            console.error("❌ 403 Forbidden - Access denied");
          }
          break;

        case 404:
          if (import.meta.env.DEV) {
            console.error("❌ 404 Not Found - Resource not found");
          }
          break;

        case 500:
          if (import.meta.env.DEV) {
            console.error("❌ 500 Internal Server Error");
          }
          break;

        default:
          if (import.meta.env.DEV) {
            console.error(
              `❌ Error ${status}:`,
              data?.message || error.message
            );
          }
      }
    } else if (error.request) {
      // Request was made but no response received
      if (import.meta.env.DEV) {
        console.error("❌ No response received:", error.message);
      }
    } else {
      // Something happened in setting up the request
      if (import.meta.env.DEV) {
        console.error("❌ Request setup error:", error.message);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
