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

export interface IGender {
  gender_id: number;
  gender_name: string;
}

export interface IAvailability {
  availability_id: number;
  availability_name: string;
}

export interface IBrand {
  brand_id: number;
  brand_name: string;
}

export interface ISize {
  size_id: number;
  catagory_id: number;
  size_name: string;
}

interface ProductSliceState {
  catagories: ICatagory[];
  colors: IColor[];
  collections: ICollection[];
  tags: ITag[];
}

const initialState: ProductSliceState = {
  catagories: [],
  colors: [],
  collections: [],
  tags: [],
};

export const productSlice = createSlice({
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

export const { setCatagories } = productSlice.actions;

export default productSlice.reducer;
