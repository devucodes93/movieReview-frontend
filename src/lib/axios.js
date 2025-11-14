import axios from "axios";
export const axiosInstance = axios.create({
  //https://social-media-backend-2-jlqe.onrender.com/api
  baseURL: "https://moviereview-backend-1.onrender.com/api",
  withCredentials: true,
  // Enable compression and optimize request size
  headers: {
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json",
  },
  // Set timeout to prevent hanging requests
  timeout: 15000,
  // Compress request data
  transformRequest: [
    function (data, headers) {
      if (data && typeof data === "object") {
        return JSON.stringify(data);
      }
      return data;
    },
  ],
});
//
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
