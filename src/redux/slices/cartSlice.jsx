import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { refreshAccessToken } from "../../utils/tokenUtils";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 < Date.now();
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, productName, price, productImage },
    { rejectWithValue }
  ) => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("User ID from localStorage:", userId);
      if (!userId || !productId || !quantity) {
        return rejectWithValue(
          "User ID, product ID, and quantity are required."
        );
      }

      let accessToken = localStorage.getItem("accessToken");

      if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
      }

      const response = await axios.post(
        "http://localhost:3000/cart/addToCart",
        {
          userId,
          items: [{ productId, quantity, productName, price, productImage }],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Add to cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in addToCart:",
        error.response ? error.response.data : error.message
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const viewCart = createAsyncThunk(
  "cart/viewCart",
  async (_, { rejectWithValue }) => {
    try {
      let accessToken = localStorage.getItem("accessToken");

      if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
      }

      const response = await axios.get("http://localhost:3000/cart/viewCart", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("View cart response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error in viewCart:", error);
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId || !productId) {
        return rejectWithValue("User ID and product ID are required.");
      }

      let accessToken = localStorage.getItem("accessToken");

      if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
      }

      const response = await axios.delete(
        "http://localhost:3000/cart/removeFromCart",
        {
          headers: { Authorization: `Bearer ${accessToken}`, userId },
          data: { productId },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("userId");

      let accessToken = localStorage.getItem("accessToken");

      if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
      }

      const response = await axios.put(
        "http://localhost:3000/cart/updateCartItemQuantity",
        {
          userId,
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  isCartVisible: false,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload.productId
      );
    },
    toggleCartVisibility: (state) => {
      state.isCartVisible = !state.isCartVisible;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.cart.items;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("Add to cart failed:", action.payload);
      })
      .addCase(viewCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(viewCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
      })
      .addCase(viewCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.cart.items;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedCart = action.payload.cart;

        updatedCart.items.forEach((updatedItem) => {
          const index = state.items.findIndex(
            (item) => item.productId._id === updatedItem._id
          );

          if (index > -1) {
            state.items[index].quantity = updatedItem.quantity;
          }
        });
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { toggleCartVisibility } = cartSlice.actions;
export default cartSlice.reducer;
