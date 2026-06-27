import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICatagory {
  catagory_id: number;
  catagory_name: string;
}

export interface IColor {
  color_id: number;
  color_name: string;
}

export interface ICollection {
  collection_id: number;
  collection_name: string;
}
export interface ITag {
  tag_id: number;
  tag_name: string;
}

interface UserSliceState {
  catagories: ICatagory[];
  colors: IColor[];
  collections: ICollection[];
  tags: ITag[];
}

const initialState: UserSliceState = {
  catagories: [],
  colors: [],
  collections: [],
  tags: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Catagories
    setCatagories: (state, action: PayloadAction<ICatagory[]>) => {
      state.catagories = action.payload;
    },

    // Collections
    setCollections: (state, action: PayloadAction<ICollection[]>) => {
      state.collections = action.payload;
    },
  },
});

export const { setCatagories } = userSlice.actions;

export default userSlice.reducer;
