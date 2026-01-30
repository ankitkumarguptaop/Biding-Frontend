import { createSlice } from "@reduxjs/toolkit";
import { signInAction, signUpAction } from "./user.action";

interface User {
  id:string
  name: string;
  email: string;
  image: string;
  token: string;
  role: string;
  isLoading: boolean;
}

const initialState: User = {
  id: "",
  name: "",
  email: "",
  image: "",
  token: "",
  role: "",
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.image = "";
      state.token = "";
      state.role = "";
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signInAction.fulfilled, (state, action) => {
      state.id = action.payload.data.user.id;
      state.name = action.payload.data.user.name;
      state.email = action.payload.data.user.email;
      state.image = action.payload.data.user.image;
      state.token = action.payload.data.token;
      state.role = action.payload.data.user.role || "user";
      state.isLoading = false;
    });
    builder.addCase(signInAction.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(signUpAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signUpAction.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image;
      state.token = action.payload.token;
      state.role = action.payload.role || "user";
      state.isLoading = false;
    });
    builder.addCase(signUpAction.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const { logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
