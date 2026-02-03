import { createAsyncThunk } from "@reduxjs/toolkit";
import { listNotifications, markAllRead, markAsRead } from "./notification.service";
import { toast } from "sonner";
import { listNotificationType, markAllReadType, markReadType } from "./notification.type";

export const listNotificationsAction = createAsyncThunk(
  listNotificationType,
  async (_, { rejectWithValue }) => {
    try {
      const response = await listNotifications();
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch notifications. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);


export const markAllReadAction = createAsyncThunk(
  markAllReadType,
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllRead();
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch notifications. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);


export const markReadAction = createAsyncThunk(
  markReadType,
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await markAsRead(notificationId);
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch notifications. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);
