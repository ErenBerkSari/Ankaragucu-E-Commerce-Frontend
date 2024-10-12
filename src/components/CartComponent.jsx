import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  viewCart,
  updateCartItem,
  removeFromCart,
} from "../redux/slices/cartSlice";

import "../css/CartComponent.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const CartComponent = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const { items, status, error } = cart;
  const [updatedItems, setUpdatedItems] = useState([]);

  useEffect(() => {
    dispatch(viewCart());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedItems(items);
  }, [items]);

  // Ürünlerin miktarını güncelleme
  const handleQuantityChange = (productId, newQuantity) => {
    setUpdatedItems((prevItems) =>
      prevItems.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const updateQuantity = (productId, increment) => {
    setUpdatedItems((prevItems) =>
      prevItems.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + increment) }
          : item
      )
    );
  };

  const handleUpdateCart = () => {
    updatedItems.forEach((item) => {
      dispatch(
        updateCartItem({
          productId: item.productId._id,
          quantity: item.quantity,
        })
      )
        .unwrap()
        .then((response) => {
          console.log("Cart item updated successfully:", response);
        })
        .catch((error) => {
          console.error("Error updating cart item:", error);
        });
    });
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }))
      .unwrap()
      .then(() => {
        dispatch(viewCart());
        console.log("Item removed successfully.");
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  // Toplam sepet fiyatını hesaplama
  const calculateTotalPrice = () => {
    return updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container-cart">
      <div className="wtf">
        <div className="cart-component-title">Sepetiniz</div>
        {updatedItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty.</div>
        ) : (
          <>
            <ul className="cart-component-ul">
              {updatedItems.map((item) => (
                <li className="cart-component-li" key={item.productId._id}>
                  <span
                    style={{
                      width: "240px",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "5px solid darkblue",
                    }}
                  >
                    <img
                      width={240}
                      height={170}
                      src={item.productImage}
                      onClick={() =>
                        navigate(`/products/${item.productId._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                  <div className="li-main">
                    <div className="li-head">
                      <div style={{ padding: "10px" }}>
                        <span style={{ marginRight: "20px" }}>
                          {item.productName}
                        </span>
                        <span>Fiyat: {item.price}₺</span>
                      </div>
                      <div
                        style={{
                          display: "flex",

                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Adet -
                          <input
                            style={{
                              width: "20px",
                              height: "20px",
                              fontWeight: "bold",
                              fontSize: "24px",
                              border: "none",
                              cursor: "pointer",
                            }}
                            type="text"
                            value={item.quantity || 0}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productId._id,
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                          Toplam: {item.price * item.quantity || 0}₺
                        </span>
                      </div>
                    </div>
                    <div className="li-foot">
                      <button
                        className="btn-quan"
                        onClick={() => updateQuantity(item.productId._id, 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn-quan"
                        onClick={() => updateQuantity(item.productId._id, -1)}
                      >
                        -
                      </button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveItem(item.productId._id)}
                      >
                        Ürünü Çıkar
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bolder",
                fontSize: 24,
              }}
            >
              Toplam Sepet Tutarı: {calculateTotalPrice() || 0}₺
            </div>
          </>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          {updatedItems.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateCart}
            >
              Sepeti Güncelle
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartComponent;
