import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  toggleCartVisibility,
  viewCart,
} from "../redux/slices/cartSlice";
import "../css/CartPopup.css";
import { Button } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Link, useNavigate } from "react-router-dom";

function CartPopup() {
  const { items, isCartVisible } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isCartVisible) return null;

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }))
      .unwrap()
      .then(() => {
        dispatch(viewCart());
        console.log("Item removed successfully.");
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  // Sepet toplam fiyatını hesaplama
  const calculateTotalPrice = () => {
    if (!items || items.length === 0) {
      return 0;
    }

    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-popup">
      <div className="popup-title">Sepetiniz</div>
      {items && items.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <>
          <ul className="cart-product">
            {items?.map((item) => (
              <li className="cart-product-li" key={item.productId._id}>
                <span
                  style={{
                    borderBottom: "2px solid darkblue",
                    borderRadius: "3px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img width={60} height={40} src={item.productImage} />
                </span>
                {item.productName}({item.quantity}) - {item.price}₺
                <button
                  className="btn-popup"
                  onClick={() => handleRemoveItem(item.productId._id)}
                >
                  <CancelIcon sx={{ paddingTop: "1px" }} />
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <p>Sepet Toplamı: {calculateTotalPrice()}₺</p>
          </div>
          {items && items.length > 0 && (
            <div className="btn-view">
              <Button
                variant="contained"
                color="inherit"
                sx={{ fontWeight: "bolder" }}
                onClick={() => navigate("/cart")}
              >
                Sepeti Görüntüle
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CartPopup;
