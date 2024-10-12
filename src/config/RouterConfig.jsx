import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../components/Home";
import Auth from "../components/Auth";
import { useDispatch, useSelector } from "react-redux";
import { checkLoginStatus } from "../redux/slices/authSlice";
import ProductDetails from "../components/ProductDetails";
import CartPopup from "../components/CartPopup";
import CartComponent from "../components/CartComponent";
import ProductsPage from "../components/ProductsPage";
import Contact from "../components/Contact";

function RouterConfig() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);

    dispatch(checkLoginStatus()); // Uygulama yüklendiğinde login durumunu kontrol et
  }, [dispatch]);
  return (
    <>
      <CartPopup />
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<CartComponent />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/contact" element={<Contact />} />
          </>
        ) : (
          <>
            <Route path="/auth" element={<Auth />} />{" "}
            {/* Giriş yapılmamışsa Auth sayfasını göster */}
            <Route path="*" element={<Auth />} />{" "}
            {/* Diğer tüm yönlendirmeler Auth sayfasına */}
          </>
        )}
      </Routes>
    </>
  );
}

export default RouterConfig;
