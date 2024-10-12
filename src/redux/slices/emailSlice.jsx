import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// E-posta gönderimi işlemi
export const sendEmail = createAsyncThunk(
  "contact/sendEmail",
  async ({ title, content }, { rejectWithValue }) => {
    const email = localStorage.getItem("email");
    console.log("React:", email);
    try {
      const response = await axiosInstance.post("auth/send-email", {
        title,
        content,
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  status: "idle",
  error: null,
  success: null,
};

const emailSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.success = null;
      });
  },
});

export default emailSlice.reducer;
