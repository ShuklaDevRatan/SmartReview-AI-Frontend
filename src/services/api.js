import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  const isPublicReviewApi = config.url?.startsWith("/api/reviews/");

  if (token && !isPublicReviewApi) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;