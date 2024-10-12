import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkLoginStatus, logout } from "../redux/slices/authSlice";
import { toggleCartVisibility, viewCart } from "../redux/slices/cartSlice";
import "../css/Header.css";
import logo from "../images/indir-Photoroom.png";
import basket from "../images/basket.png";

function Header() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <div className="header">
      <img id="logo" width={60} height={60} src={logo} alt="Logo" />
      <div className="header-title">ANKARAGÜCÜ E-COMMERCE</div>
      <div className="navbar">
        <Link className="navbar-link" to="/">
          Anasayfa
        </Link>
        <Link className="navbar-link" to="/products">
          Ürünlerimiz
        </Link>
        <Link className="navbar-link" to="/contact">
          İletişim
        </Link>

        {isLoggedIn ? (
          <div>
            <span
              className="navbar-link"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>
          </div>
        ) : (
          <Link className="navbar-link" to="/auth">
            Login/Register
          </Link>
        )}
        {isLoggedIn ? (
          <span
            className="navbar-link"
            onClick={() => {
              dispatch(toggleCartVisibility()); // Sepeti göster/gizle
              dispatch(viewCart()); // Sepeti güncelle
            }}
          >
            <img width={30} height={30} src={basket} alt="Sepet" />
          </span>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default Header;
