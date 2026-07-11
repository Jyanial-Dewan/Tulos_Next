export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
export const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
export const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
export const ACCESS_TOKEN_EXPIRED_TIME = process.env.ACCESS_TOKEN_EXPIRED_TIME;
export const REFRESH_TOKEN_EXPIRED_TIME =
  process.env.REFRESH_TOKEN_EXPIRED_TIME;

export const endpoints = {
  Login: "/auth/login",
  User: "/auth/user",
  Register: "/users",
  Catagories: "/categories",
  Collections: "/collections",
  Colors: "/colors",
  Tags: "/tags",
  Genders: "/genders",
  Availabilities: "/availabilities",
  Brands: "/brands",
  Sizes: "/sizes",
  Products: "/products",
  ProductTags: "/product_tags",
  ProductVariants: "/product_variants",
  ProductImages: "/product_images",
  CartItems: "/cart_items",
};
