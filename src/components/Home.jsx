import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/slices/productSlice";
import "../css/Product.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { toggleCharacterVisibility } from "../redux/slices/authSlice";

function Home() {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);
  const navigate = useNavigate();
  const { characterIsVisible } = useSelector((store) => store.auth);

  const handleClick = () => {
    dispatch(toggleCharacterVisibility(false));
  };
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <div className="home-container">
      {characterIsVisible && (
        <div className="character">
          <div className="speech-bubble">
            <p className="character-text">
              Merhaba sevgili Ankaragüçlü! Ankaragücü e-ticaret sitesine
              hoşgeldin. Bize destek olmaya devam et. Unutma gururluyuz,
              güçlüyüz çünkü biz Ankaragüçlüyüz!
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={handleClick}
              >
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="carousel-container">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={3000}
          showStatus={false}
          swipeable
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="product-slide"
              onClick={() => navigate(`/products/${product._id}`)}
            >
              <img src={product.image} alt={product.name} />
              <p className="legend">{product.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Home;
