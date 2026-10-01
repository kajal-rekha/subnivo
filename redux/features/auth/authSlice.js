import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userAndToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userAndToken = action.payload;
      if (typeof window !== "undefined" && action.payload?.token) {
        window.localStorage.setItem("subnivo_token", action.payload.token);
      }
    },
    signup: (state, action) => {
      state.userAndToken = action.payload;
      if (typeof window !== "undefined" && action.payload?.token) {
        window.localStorage.setItem("subnivo_token", action.payload.token);
      }
    },

    logout: (state) => {
      state.userAndToken = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("subnivo_token");
      }
    },
  },
});

export const { login, signup, logout } = authSlice.actions;
export default authSlice.reducer;
