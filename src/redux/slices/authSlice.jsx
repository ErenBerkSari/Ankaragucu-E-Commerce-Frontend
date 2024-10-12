import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Login attempt for:", credentials.email);
      const response = await axiosInstance.post("/auth/login", credentials);
      console.log(response.data);
      localStorage.setItem("accessToken", response.data.accessToken); // Access token'ı localStorage'a kaydet
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("userId", response.data.userId); // userId'yi localStorage'a kaydet
      localStorage.setItem("email", response.data.email);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Login failed. Please try again.");
      }
    }
  }
);

// Kayıt işlemi
export const register = createAsyncThunk(
  "auth/register",
  async (userInfo, { rejectWithValue }) => {
    try {
      console.log("Register attempt for:", userInfo.email);
      const response = await axiosInstance.post("/auth/register", userInfo);
      localStorage.setItem("accessToken", response.data.accessToken); // Access token'ı localStorage'a kaydet
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("userId", response.data.userId); // userId'yi localStorage'a kaydet
      localStorage.setItem("email", response.data.email);

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return rejectWithValue(
          "User already exists. Please use a different email or username."
        );
      } else if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Registration failed. Please try again.");
      }
    }
  }
);

// Çıkış işlemi
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem("refreshToken"); // Refresh token'ı localStorage'dan al
    try {
      await axiosInstance.post("/auth/logout", { refreshToken }); // Refresh token ile logout isteği gönder
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Logout failed. Please try again.");
      }
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("Checking refresh token:", refreshToken);

    if (!refreshToken) {
      console.log("No refresh token available.");
      return rejectWithValue("No refresh token available.");
    }

    try {
      console.log("Attempting to refresh access token with refresh token.");
      const response = await axiosInstance.post("/auth/refresh", {
        refreshToken,
      });
      const { accessToken } = await response.data;
      console.log("Access token received:", accessToken);
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (error) {
      console.error("Refresh token error:", error);
      localStorage.removeItem("refreshToken");
      return rejectWithValue("Failed to refresh access token.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    error: null,
    characterIsVisible: false,
  },
  reducers: {
    checkLoginStatus: (state) => {
      const token = localStorage.getItem("accessToken"); // Token'ı localStorage'dan oku

      if (token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const decodedPayload = JSON.parse(window.atob(base64));

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedPayload.exp < currentTime) {
          state.isLoggedIn = false; // Token süresi dolmuş
        } else {
          state.isLoggedIn = true; // Geçerli token
        }
      } else {
        state.isLoggedIn = false; // Token yok
      }
    },
    clearUserState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    toggleCharacterVisibility: (state, action) => {
      state.characterIsVisible = action.payload; // true veya false değerini alır
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        state.characterIsVisible = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        state.characterIsVisible = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("accessToken"); // Token'ı localStorage'dan sil
        localStorage.removeItem("refreshToken"); // Token'ı localStorage'dan sil
        localStorage.removeItem("userId"); // userId'yi localStorage'dan sil
        localStorage.removeItem("email"); // userId'yi localStorage'dan sil

        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoggedIn = true;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export const { checkLoginStatus, clearUserState, toggleCharacterVisibility } =
  authSlice.actions;
export default authSlice.reducer;
