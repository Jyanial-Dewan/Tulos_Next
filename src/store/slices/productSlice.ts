import { createSlice } from "@reduxjs/toolkit";

export interface IVariant {
  variant_id?: number;
  color_id: number;
  size_id: number;
  sku: string;
  barcode?: string | null;
  price: number;
  compare_at_price?: number | null;
  cost_price?: number | null;
  stock: number;
  weight?: number | null;
}

interface ProductSliceState {
  variants: IVariant[];
}

const initialState: ProductSliceState = {
  variants: [],
};

export const catalogSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export const {} = catalogSlice.actions;

export default catalogSlice.reducer;
