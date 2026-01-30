import { createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { createItemType, filters, getItemType, listItemType } from "./item.type";
import { createItem, getItem, listItem } from "./item.service";

export const listItemAction = createAsyncThunk(
  listItemType,
  async (data: filters, { rejectWithValue }) => {
    try {
      const response = await listItem(data);
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to list items. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const getItemAction = createAsyncThunk(
  getItemType,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getItem(id);
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to retrieve item. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const createItemAction = createAsyncThunk(
  createItemType,
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await createItem(data);
      toast.success("Item created successfully!");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create item. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);