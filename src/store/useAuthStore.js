import { create } from "zustand";

import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  setAuthUser: (user) => set({ authUser: user }),
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isLoggingOut: false,

  // user login
  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        set({ authUser: response.data, isLoggingIn: false });
        localStorage.setItem("token", response.data.token);

        toast.success("Login Successful");
      } else {
        toast.error("Invalid credentials");
        set({ isLoggingIn: false });
      }
    } catch (error) {
      console.log(error.message);
      set({ isLoggingIn: false });
      toast.error("Invalid credential");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  //use logout
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const response = await axiosInstance.post("/auth/logout");
      toast.success(response.data.message);
      set({ authUser: null });
      localStorage.removeItem("token");

      set({ isLoggingOut: false });
    } catch (error) {
      set({ isLoggingOut: false });
      console.log("error while logout", error.message);
    }
  },

  // check auth status
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/check-auth");
      if (response.status === 200) {
        set({ authUser: response.data, isCheckingAuth: false });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // user sign up
  signUp: async (name, email, phoneNumber, password) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        phoneNumber,
        password,
      });

      set({ authUser: response.data, isSigningUp: false });
      toast.success("Sign Up Successful");

      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.log(error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error(error.message || "Network error");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
