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

interface CatalogSliceState {
  catagories: ICatagory[];
  colors: IColor[];
  collections: ICollection[];
  tags: ITag[];
  genders: IGender[];
  availabilities: IAvailability[];
  brands: IBrand[];
  sizes: ISize[];
}

const initialState: CatalogSliceState = {
  catagories: [],
  colors: [],
  collections: [],
  tags: [],
  genders: [],
  availabilities: [],
  brands: [],
  sizes: [],
};

export const catalogSlice = createSlice({
  name: "catalog",
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

    // Colors
    setColors: (state, action: PayloadAction<IColor[]>) => {
      state.colors = action.payload;
    },

    // Tags
    setTags: (state, action: PayloadAction<ITag[]>) => {
      state.tags = action.payload;
    },

    // Genders
    setGenders: (state, action: PayloadAction<IGender[]>) => {
      state.genders = action.payload;
    },

    // Availabilities
    setAvailabilities: (state, action: PayloadAction<IAvailability[]>) => {
      state.availabilities = action.payload;
    },

    // Brands
    setBrands: (state, action: PayloadAction<IBrand[]>) => {
      state.brands = action.payload;
    },

    // Sizes
    setSizes: (state, action: PayloadAction<ISize[]>) => {
      state.sizes = action.payload;
    },
  },
});

export const {
  setCatagories,
  setCollections,
  setColors,
  setAvailabilities,
  setBrands,
  setGenders,
  setSizes,
  setTags,
} = catalogSlice.actions;

export default catalogSlice.reducer;
