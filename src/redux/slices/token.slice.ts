import { createSlice } from "@reduxjs/toolkit";
import { LocalStorageKeys, SliceAndReducersName } from "../../data/app.constant";
import { StorageService } from "../../services/storage.service";

const storageSvc = new StorageService();

const tokenSlice = createSlice({
  name: SliceAndReducersName.TOKEN,
  initialState: storageSvc.getItem(LocalStorageKeys.TOKEN),
  reducers: {
    setToken: (state, action) => {
      storageSvc.setItem(LocalStorageKeys.TOKEN, action.payload);
      return action.payload;
    },
    removeToken: (state) => {
      storageSvc.removeItem(LocalStorageKeys.TOKEN);
      return null;
    },
  },
});

export const { setToken, removeToken } = tokenSlice.actions;
export default tokenSlice.reducer;
