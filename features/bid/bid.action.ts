import { createAsyncThunk } from "@reduxjs/toolkit";
import { createBid, listBid } from "./bid.service";
import { toast } from "sonner";
import { BidPayload, createBidType, listBidType } from "./bid.type";

export const createBidAction = createAsyncThunk(
  createBidType,
  async (data: BidPayload, { rejectWithValue }) => {
    try {
      const response = await createBid(data);
      toast.success("Bid created successfully!");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create bid. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);



export const listBidAction = createAsyncThunk(
  listBidType,
  async (_, { rejectWithValue }) => {
    try {
      const response = await listBid();
      toast.success("Bid created successfully!");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create bid. Please try again.";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);