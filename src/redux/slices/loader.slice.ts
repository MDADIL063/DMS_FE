import { createSlice } from "@reduxjs/toolkit";
import { SliceAndReducersName } from "../../data/app.constant";

const loaderSlice = createSlice({
  name: SliceAndReducersName.LOADER,
  initialState: false,
  reducers: {
    showLoader: (state) => {
      return true;
    },
    hideLoader: (state) => {
      return false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
