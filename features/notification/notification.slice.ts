import { createSlice } from "@reduxjs/toolkit";
import { listNotificationsAction } from "./notification.action";

interface Notifications {
  id: string;
  isRead: boolean;
  message: string;
  createdAt: string;
}
interface NotificationInitialState {
  isLoading: boolean;
  notifications: Notifications[];
  totalCount?: number;
}

const initialState: NotificationInitialState = {
  isLoading: false,
  notifications: [],
  totalCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    incrementTotalCount: (state) => {
      state.totalCount = (state.totalCount || 0) + 1;
    },
    addNewNotification: (state, action) => {
      state.totalCount = (state.totalCount || 0) + 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listNotificationsAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(listNotificationsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload.data;
    });
    builder.addCase(listNotificationsAction.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const notificationReducer = notificationSlice.reducer;
export const { incrementTotalCount ,addNewNotification } = notificationSlice.actions;
