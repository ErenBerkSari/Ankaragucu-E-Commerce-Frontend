import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  categories: [],
  filteredProducts: [],
  status: null,
  error: null,
};
const BASE_URL = "http://localhost:3000";

export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async () => {
    const response = await axios.get(`${BASE_URL}/categories/getAllCategories`);
    return response.data;
  }
);

export const getProductsByCategory = createAsyncThunk(
  "categories/getProductsByCategory",
  async (categoryId) => {
    const response = await axios.get(`${BASE_URL}/products/getAllProducts`, {
      params: { categoryId },
    });
    return response.data;
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetFilteredProducts(state) {
      state.filteredProducts = []; // filteredProducts dizisini sıfırla
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredProducts = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { resetFilteredProducts } = categorySlice.actions;

export default categorySlice.reducer;
