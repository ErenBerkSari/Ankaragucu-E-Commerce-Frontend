import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 saniye zaman aşımı (istek uzun sürerse iptal edilir)
});

// Token'ın süresinin dolup dolmadığını kontrol eden yardımcı fonksiyon
export const isTokenExpired = (token) => {
  if (!token) return true; // Token yoksa süresi dolmuş kabul edelim
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Şu anki zaman (saniye cinsinden)
    return payload.exp < currentTime; // Token süresi dolmuşsa true döner
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Geçersiz token varsa da süresi dolmuş gibi işlem yap
  }
};

// Token'ı her istek öncesinde ekleyin
export const setDispatch = (dispatch) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      let accessToken = localStorage.getItem("accessToken");

      if (config.url !== "/auth/login" && config.url !== "/auth/register") {
        console.log("Making request to:", config.url);
        if (accessToken && !isTokenExpired(accessToken)) {
          console.log("Access token found and valid.");
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          console.log(
            "Access token expired or not found. Attempting to refresh..."
          );
          try {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } catch (error) {
            console.error("Error during token refresh:", error);
            throw new axios.Cancel("Token refresh failed");
          }
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default axiosInstance;
