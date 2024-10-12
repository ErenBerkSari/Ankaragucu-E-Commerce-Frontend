import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import emailReducer from "./slices/emailSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    category: categoryReducer,
    email: emailReducer,
  },
});
