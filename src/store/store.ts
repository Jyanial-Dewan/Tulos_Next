import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { productSlice } from "./slices/productSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userSlice.reducer,
      product: productSlice.reducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
