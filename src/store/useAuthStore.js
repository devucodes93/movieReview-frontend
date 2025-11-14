import { create } from "zustand";

import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  setAuthUser: (user) => set({ authUser: user }),
  isSigningUp: false,
  isLoggingIn: false,
  allUsers: [],
  profileInspect: null,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  authInspect: null,
  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      console.log(email, password);
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        set({ authUser: response.data, isLoggingIn: false });
        localStorage.setItem("token", response.data.token);
        console.log(response.data, "auth from login");
        toast.success("Login Successful");
      } else {
        console.log(response);
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
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.post("/auth/check-auth");
      if (response.status === 200) {
        set({ authUser: response.data, isCheckingAuth: false });
      }
      console.log(get().authUser, "auth from ceckauth");
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
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
      console.log(get().authUser, "auth from signup");
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.log(error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        // Network error, no response
        toast.error(error.message || "Network error");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
  getAllUsers: async () => {
    console.log("bye");
    try {
      const response = await axiosInstance.get("/auth/get-all-users");
      if (response.status === 200) {
        set({ allUsers: response.data, isCheckingAuth: false });
        console.log(get().allUsers, "all users");
        return response.data;
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  getUserProfile: async (userId) => {
    set({ profileInspect: null });
    try {
      const response = await axiosInstance.get(
        `/auth/user-profile/?userId=${userId}`
      );
      set({ profileInspect: response.data });
      console.log(get().profileInspect);
    } catch (error) {
      console.log(error.message);
    }
  },
  getMyProfile: async () => {
    try {
      const response = await axiosInstance("/auth/auth-profile");
      if (response.status == 201) {
        console.log(response.data);
        set({ authInspect: response.data });
      }
    } catch (error) {
      console.log(error);
    }
  },
  postDelete: async (postId) => {
    if (!postId) return;
    const response = await axiosInstance.delete(
      `/post/delete-post/?postId=${postId}`
    );
    if (response.status == 201) {
      set({ authInspect: null });
    }
  },
}));
