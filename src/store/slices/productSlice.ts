import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  image_urls: string[];
}

export interface IProductVariant {
  variant_id: number;
  product_id: number;
  color_id?: number;
  size_id?: number;
  sku: string;
  barcode?: string;
  price: number;
  stock?: number;
  created_at: Date;
  updated_at: Date;
}

export interface IProductTags {
  product_id: number;
  tag_id: number;
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
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;

export default productSlice.reducer;
