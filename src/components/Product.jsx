import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/slices/productSlice";
import "../css/Product.css";
import { useNavigate } from "react-router-dom";
import { resetFilteredProducts } from "../redux/slices/categorySlice";

function Product() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const { filteredProducts } = useSelector((store) => store.category);

  const navigate = useNavigate();
  React.useEffect(() => {
    dispatch(getAllProducts());
    dispatch(resetFilteredProducts());
  }, [dispatch]);
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };
  return (
    <div className="product-list">
      {(filteredProducts.length > 0 ? filteredProducts : products).map(
        (product) => (
          <div key={product._id} className="product-card">
            <div className="card-title"> {product.name}</div>
            <div className="card-image">
              <img
                width={200}
                height={160}
                src={product.image}
                alt={product.name}
              />
            </div>
            <Button
              onClick={() => handleProductClick(product._id)}
              variant="contained"
              sx={{ backgroundColor: "darkblue" }}
            >
              Ürüne Git
            </Button>
          </div>
        )
      )}
    </div>
  );
}

export default Product;
