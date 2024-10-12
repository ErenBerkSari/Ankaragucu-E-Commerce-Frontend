// tokenUtils.js
import axios from "axios";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  try {
    const response = await axios.post("http://localhost:3000/auth/refresh", {
      refreshToken,
    });
    const accessToken = response.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh access token");
  }
};
