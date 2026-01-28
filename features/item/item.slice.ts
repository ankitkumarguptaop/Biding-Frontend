import { createSlice } from "@reduxjs/toolkit";
import { listItemAction } from "./item.action";

export enum Status {
  UPCOMING = "UPCOMING",
  LIVE = "LIVE",
  CLOSED = "CLOSED",
  EXPIRED = "EXPIRED",
}

export interface Item {
  id: string;
  title: string;
  description: string;
  minBidPrice: number;
  image: string;
  isLoading: boolean;
  status: Status;
}

interface ItemInitialState {
  items: Item[]; // for all items
  currentItem?: Item; // for single item details
  isLoading?: boolean;
}

const initialState: ItemInitialState = {
  items: [],
  isLoading: false,
  currentItem: undefined,
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
  },
});

export const itemReducer = itemSlice.reducer;
