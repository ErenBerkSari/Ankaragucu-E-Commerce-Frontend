import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Product from "./Product";
import Category from "./Category";
import { resetFilteredProducts } from "../redux/slices/categorySlice"; // yeni ekle

function ProductsPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetFilteredProducts());
  }, [dispatch]);

  return (
    <div>
      <div>
        <Category />
      </div>
      <div>
        <Product />
      </div>
    </div>
  );
}

export default ProductsPage;
