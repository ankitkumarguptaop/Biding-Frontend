import { createSlice } from "@reduxjs/toolkit";
import { createItemAction, getItemAction, listItemAction } from "./item.action";
import { Inter } from "next/font/google";

export enum Status {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  CLOSED = "CLOSED",
  EXPIRED = "EXPIRED",
  ALL = "ALL",
}

export interface  Bids{
  id: string;
  bidAmount: number;
  createdAt: string;
  user  :{
    id: string;
    name: string;
    email: string;
  }
} 


export interface Item {
  id: string;
  title: string;
  description: string;
  minBidPrice: number;
  image: string;
  isLoading: boolean;
  status: Status;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  currentHighestBid: number;
  bids: Bids[];
  currentWinner :{
    id: string;
    name: string;
    email: string;
  }
}

interface ItemInitialState {
  items: Item[]; // for all items
  currentItem: Item; // for single item details
  isLoading?: boolean;
}

const initialState: ItemInitialState = {
  items: [],
  isLoading: false,
  currentItem: {} as Item,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(listItemAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(listItemAction.fulfilled, (state, action) => {
      state.items = action.payload.rows;
      state.isLoading = false;
    });
    builder.addCase(listItemAction.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getItemAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getItemAction.fulfilled, (state, action) => {
      state.currentItem = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getItemAction.rejected, (state, action) => {
      state.isLoading = false;
    });
     builder.addCase(createItemAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createItemAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createItemAction.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const itemReducer = itemSlice.reducer;
