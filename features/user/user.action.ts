import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn, signUp } from "./user.service";
import {
  SignInPayload,
  signInType,
  SignUpPayload,
  signUpType,
} from "./user.type";
import { toast } from "sonner";

export const signInAction = createAsyncThunk(
  signInType,
  async (data: SignInPayload, { rejectWithValue }) => {
    try {
      const response = await signIn(data);
      toast.success("Login successful!");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sign in. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const signUpAction = createAsyncThunk(
  signUpType,
  async (data: SignUpPayload | FormData, { rejectWithValue }) => {
    try {
      const response = await signUp(data);
      toast.success("Account created successfully!");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create account. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
