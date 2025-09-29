import { createSlice } from "@reduxjs/toolkit";
import { LocalStorageKeys, SliceAndReducersName } from "../../data/app.constant";
import { StorageService } from "../../services/storage.service";
import { IUser } from "../../interfaces/user.interface";

const storageSvc = new StorageService();

const loggedInUserSlice = createSlice({
  name: SliceAndReducersName.LOGGED_IN_USER,
  initialState: storageSvc.getItem(LocalStorageKeys.LOGGED_IN_USER),
  reducers: {
    setLoggedInUser: (state: IUser, action): IUser => {
      storageSvc.setItem(LocalStorageKeys.LOGGED_IN_USER, action.payload);
      return action.payload;
    },
    removeLoggedInUser: (state: IUser): null => {
      storageSvc.removeItem(LocalStorageKeys.LOGGED_IN_USER);
      return null;
    },
  },
});

export const { setLoggedInUser, removeLoggedInUser } = loggedInUserSlice.actions;
export default loggedInUserSlice.reducer;
