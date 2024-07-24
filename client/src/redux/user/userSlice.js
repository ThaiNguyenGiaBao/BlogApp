import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    error: null,
  },
  reducers: {
    signInStart: (state) => {
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.error = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateSuccess,
  updateFailure,
  signOut,
} = userSlice.actions;
export default userSlice.reducer;
