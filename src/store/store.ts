import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { catalogSlice } from "./slices/catalogSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userSlice.reducer,
      catalog: catalogSlice.reducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
