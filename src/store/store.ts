import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/features/counter/counterSlice";
import authReducer from "@/features/auth/authSlice";

export const makeStore = () =>
  configureStore({
    reducer: { counter: counterReducer, auth: authReducer },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
