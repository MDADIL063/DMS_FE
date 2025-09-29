import { configureStore } from "@reduxjs/toolkit";
import { SliceAndReducersName } from "../data/app.constant";
import loaderSlice from "./slices/loader.slice";
import loggedInUserSlice from "./slices/loggedInUser.slice";
import tokenSlice from "./slices/token.slice";

export const store = configureStore({
  reducer: {
    [SliceAndReducersName.LOGGED_IN_USER]: loggedInUserSlice,
    [SliceAndReducersName.TOKEN]: tokenSlice,
    [SliceAndReducersName.LOADER]: loaderSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
