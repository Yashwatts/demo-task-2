import { LoginSchema } from "@/schemas/login-schema";
import { SignupSchema } from "@/schemas/signup-schema";
import { api } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState } from "./auth.slice";

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData: SignupSchema, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (formData: LoginSchema, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.loggingOut) {
      return rejectWithValue("Check auth skipped: Logout in progress");
    }
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Check auth failed",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);
