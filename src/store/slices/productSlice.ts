import { createSlice } from "@reduxjs/toolkit";

export interface IProduct {
  product_id: number;
  product_name: string;
  description: string;
  catagory_id: number;
  brand_id: number;
  collection_id: number;
  gender_id: number;
  availability_id: number;
  created_at: Date;
  updated_at: Date;
}

interface ProductSliceState {
  products: IProduct[];
}

const initialState: ProductSliceState = {
  products: [],
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export const {} = productSlice.actions;

export default productSlice.reducer;
