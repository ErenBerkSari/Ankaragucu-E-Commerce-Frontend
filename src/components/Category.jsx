import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  getProductsByCategory,
} from "../redux/slices/categorySlice";
import "../css/Category.css";
import { useNavigate } from "react-router-dom";

function Category() {
  const dispatch = useDispatch();
  const { categories, filteredProducts, status, error } = useSelector(
    (store) => store.category
  );
  const navigate = useNavigate();
  console.log(filteredProducts);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Kategoriye göre ürünleri filtreleyen fonksiyon
  const handleCategoryClick = (categoryId) => {
    dispatch(getProductsByCategory(categoryId));
  };

  return (
    <div className="category-list">
      <button className="category" onClick={() => handleCategoryClick()}>
        Tümü
      </button>

      {categories &&
        categories.map((category) => (
          <button
            className="category"
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
          >
            {category.name}
          </button>
        ))}

      {status === "loading" && <p>Loading products...</p>}
      {status === "failed" && <p>Error loading products: {error}</p>}
    </div>
  );
}

export default Category;
