import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserTokenState {
  isLoggedIn: boolean;
  user_id: number;
  user_type: string;
  access_token: string;
  refresh_token: string;
  issuedAt: string;
}

export interface UserState {
  user_id: number;
  username: string;
  user_type: string;
  email: string;
  phone: string[];
  first_name: string;
  last_name: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  connection_time: string | null;
  profile_image_original: string;
  profile_image_thumbnail: string;
  address?: string;
}

interface UserSliceState {
  token: UserTokenState;
  user: UserState;
  users: UserState[];
}

const initialState: UserSliceState = {
  token: {
    isLoggedIn: false,
    user_id: 0,
    user_type: "",
    access_token: "",
    refresh_token: "",
    issuedAt: "",
  },
  user: {
    user_id: 0,
    username: "",
    user_type: "",
    email: "",
    phone: [],
    first_name: "",
    last_name: "",
    created_at: "",
    latitude: null,
    longitude: null,
    connection_time: null,
    profile_image_original: "",
    profile_image_thumbnail: "",
    address: "",
  },
  users: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<UserTokenState>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.token = initialState.token;
      state.user = initialState.user;
      state.users = initialState.users;
    },
    setUsers: (state, action: PayloadAction<UserState[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setToken, setUser, logout, setUsers } = userSlice.actions;

export default userSlice.reducer;
