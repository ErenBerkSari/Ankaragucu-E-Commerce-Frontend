import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  product: null, // Tekil ürün için state ekliyoruz
};

const BASE_URL = "http://localhost:3000";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async () => {
    const response = await axios.get(`${BASE_URL}/products/getAllProducts`);
    return response.data;
  }
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (productId) => {
    const response = await axios.get(
      `${BASE_URL}/products/getProduct/${productId}`
    );
    return response.data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload; // Tekil ürünü state'e ekliyoruz
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
