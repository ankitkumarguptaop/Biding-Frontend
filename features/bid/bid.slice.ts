import { createSlice } from "@reduxjs/toolkit";
import { createBidAction, listBidAction } from "./bid.action";
import { Bids } from "../item/item.slice";


interface BidsWithUser extends Bids {
  user: {
    id: string;
    name: string;
    email: string;
  };
  item:{
    id: string;
    title: string;
    description: string;
    currentWinnerId : string;
    currentHighestBid: number;
    image :string;
  }
}
interface BidInitialState {
  isLoading: boolean;
  bids: BidsWithUser[];
  totalCount?: number;
}

const initialState: BidInitialState = {
  isLoading: false,
  bids: [],
  totalCount: 0,
};

const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    incrementTotalCount: (state) => {
      state.totalCount = (state.totalCount || 0) + 1; 
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createBidAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createBidAction.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createBidAction.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(listBidAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(listBidAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bids = action.payload.rows;
      state.totalCount = action.payload.count;
    });
    builder.addCase(listBidAction.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const bidReducer = bidSlice.reducer;
export const { incrementTotalCount } = bidSlice.actions;
