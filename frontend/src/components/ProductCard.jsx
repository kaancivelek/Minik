import React from "react";
import {useNavigate} from "react-router-dom";
import { addStars } from "../utils/countingStars";
export default function ProductCard({ house, imageUrl }) {

  const navigate = useNavigate();    
  
      
  return (
    <div className="product-card" onClick={() => navigate(`/TinyHouseDetails/${house.id}`)} style={{ cursor: "pointer" }} >
    
      <div className="product-image">
        <img
          alt={house.name}
          src={
            imageUrl
              ? `${imageUrl}?w=300&h=200&fit=crop`
              : `https://dummyimage.com/300x200/cccccc/000000&text=Resim+Yok`
          }
          className="card-img"
          onError={(e) => {
            const target = e.target;
            let retryCount = parseInt(target.getAttribute("data-retry") || "0", 10);

            if (retryCount < 2) {
              target.setAttribute("data-retry", retryCount + 1);
              target.src = imageUrl + `?retry=${retryCount + 1}`;
            } else {
              target.src =
                "https://dummyimage.com/300x200/ff0000/ffffff&text=Resim+Yüklenemedi";
              target.onerror = null;
            }
          }}
        />
      </div >
      <div className="product-details">
        <h2 className="product-name">{house.name}</h2>
        <p className="product-location">
          {house.city}, {house.country}
        </p>
        {/* <p className="product-description">{house.description}</p> */}
        <p className="product-price">
          {house.pricePerNight} TL <span className="price-note">(gece)</span>
        </p>
        <p className="product-rating">{addStars(house.rating)} </p>
        <p className="product-amenities">İmkanlar: {house.amenities}</p>
        <p className="product-max-guests"></p>
      </div>
    </div>
  );
}