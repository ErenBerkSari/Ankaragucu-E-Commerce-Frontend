import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate'ı import ettik
import { getProduct } from "../redux/slices/productSlice";
import { addToCart, viewCart } from "../redux/slices/cartSlice";
import "../css/ProductDetails.css";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Cookies from "js-cookie";

function ProductDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { product, products } = useSelector((state) => state.product);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("ProductDetails Component Rendered");
    console.log("Logged In Status:", isLoggedIn);

    if (productId) {
      dispatch(getProduct(productId)).catch((error) => {
        console.error("Failed to fetch product:", error);
      });
    }
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (product) {
      console.log("Adding to cart with productId:", product._id, "quantity: 1");

      dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
          productName: product.name,
          price: product.price,
          productImage: product.image,
        })
      )
        .then(() => {
          dispatch(viewCart());
        })
        .catch((error) => {
          console.error("Failed to add to cart:", error);
        });
    }
  };

  const handlePrevious = () => {
    const currentIndex = products.findIndex((p) => p._id === productId);
    if (currentIndex > 0) {
      const previousProductId = products[currentIndex - 1]._id;
      navigate(`/products/${previousProductId}`);
    }
  };

  const handleNext = () => {
    const currentIndex = products.findIndex((p) => p._id === productId);
    if (currentIndex < products.length - 1) {
      const nextProductId = products[currentIndex + 1]._id;
      navigate(`/products/${nextProductId}`);
    }
  };

  return (
    <div>
      {product ? (
        <div className="single-product">
          <div className="navigation-buttons">
            <Button
              sx={{
                backgroundColor: "darkblue",
                color: "#fff",
                marginLeft: "10px",
              }}
              variant="outlined"
              onClick={handlePrevious}
              disabled={products.findIndex((p) => p._id === productId) === 0} // İlk üründeysen butonu devre dışı bırak
            >
              Önceki
            </Button>
            <Button
              sx={{
                backgroundColor: "darkblue",
                color: "#fff",
                marginRight: "20px",
              }}
              variant="outlined"
              onClick={handleNext}
              disabled={
                products.findIndex((p) => p._id === productId) ===
                products.length - 1
              } // Son üründeysen butonu devre dışı bırak
            >
              Sonraki
            </Button>
          </div>
          <h1 className="product-title">{product.name}</h1>
          <img
            id="product-image"
            width={440}
            height={350}
            src={product.image}
            alt={product.name}
          />
          <p className="product-desc">{product.description}</p>
          <p className="price">Fiyat: {product.price}</p>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkblue" }}
            onClick={handleAddToCart}
          >
            <AddShoppingCartIcon />
            Sepete Ekle
          </Button>
        </div>
      ) : (
        <div>Ürün bulunamadı</div>
      )}
    </div>
  );
}

export default ProductDetails;
