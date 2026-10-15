import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("timexUser");

  if (stored) {
    try {
      const { token } = JSON.parse(stored);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("timexUser");
    }
  }

  return config;
});

export default API;