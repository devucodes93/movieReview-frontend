import axios from "axios";
export const axiosInstance = axios.create({
  //https://moviereview-backend-1.onrender.com/api
  baseURL: "http://localhost:3001/api/",
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,

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
