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
  min_price?: number;
  max_price?: number;
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

export interface ICartItem {
  cart_item_id: number;
  user_id: number;
  quantity: number;
  added_at: Date;
  variant_id: number;
  sku: string;
  barcode?: string;
  price: string; // numeric string, e.g. "236.99"
  stock: number;
  line_total: string; // numeric string, e.g. "236.99"
  product_id: number;
  product_name: string;
  description: string;
  color_id?: number;
  color_name?: string;
  size_id?: number;
  size_name?: string;
  image_url: string;
}

export interface IProductTags {
  product_id: number;
  tag_id: number;
}

interface ProductSliceState {
  products: IProduct[];
  cartItems: ICartItem[];
  cartController: number;
}

const initialState: ProductSliceState = {
  products: [],
  cartItems: [],
  cartController: 1,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Products
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },
    // CartItems
    setCartItem: (state, action: PayloadAction<ICartItem[]>) => {
      state.cartItems = action.payload;
    },
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      state.cartItems = [...state.cartItems, action.payload];
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find(
        (item) => item.cart_item_id === action.payload,
      );
      if (item) {
        item.quantity += 1;
        item.line_total = (Number(item.price) * item.quantity).toFixed(2);
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cartItems.find(
        (item) => item.cart_item_id === action.payload,
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.line_total = (Number(item.price) * item.quantity).toFixed(2);
      }
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.cart_item_id !== action.payload,
      );
    },

    // CartController
    cartControllerIncrease: (state) => {
      state.cartController += 1;
    },
  },
});

export const {
  setProducts,
  setCartItem,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  addToCart,
  cartControllerIncrease,
} = productSlice.actions;

export default productSlice.reducer;
