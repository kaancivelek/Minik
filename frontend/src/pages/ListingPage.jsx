import React, { useEffect, useState } from "react";
import "../styles/ListingPage.css";
import { getTinyHouseByRange } from "../services/tinyHouseService";
import { getTinyHouseImagesByTinyHouseId } from "../services/houseImages";
import ProductCard from "../components/ProductCard";
import { filterListings, sortListings } from "../utils/listingUtils";


export default function ListingPage({ filterText, sortOrder }) {
  const [tinyHouses, setTinyHouses] = useState([]);
  const [imagesMap, setImagesMap] = useState({});
  const [offset, setOffset] = useState(0);
  const [isListingsLoading, setIsListingsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filteredListings, setFilteredListings] = useState([]);

  const range = 8;

  const fetchTinyHousesByListingAmount = async (currentOffset, replace = false) => {
    setIsListingsLoading(true);
    try {
      const response = await getTinyHouseByRange(currentOffset, range);
      if (response && response.length > 0) {
        setTinyHouses((prev) => (replace ? [...response] : [...prev, ...response]));

        const imagesPromises = response.map(async (house) => {
          const images = await fetchTinyHouseImages(house.id);
          return { houseId: house.id, imageUrl: images[0]?.imageUrl || null };
        });

        const imagesResults = await Promise.all(imagesPromises);
        setImagesMap((prev) => {
          const newMap = { ...prev };
          imagesResults.forEach(({ houseId, imageUrl }) => {
            if (imageUrl) newMap[houseId] = imageUrl;
          });
          return newMap;
        });

        if (response.length < range) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching tiny houses:", error);
    } finally {
      setIsListingsLoading(false);
    }
  };

  const fetchTinyHouseImages = async (tinyHouseId) => {
    try {
      const response = await getTinyHouseImagesByTinyHouseId(tinyHouseId);
      return response || [];
    } catch (error) {
      console.error(`Image error for house ID ${tinyHouseId}:`, error);
      return [];
    }
  };

  // Filtre veya sıralama değiştiğinde baştan yükle
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchTinyHousesByListingAmount(0, true);
  }, [filterText, sortOrder]);

  // Filtreleme ve sıralama işlemi
  useEffect(() => {
    let updatedListings = filterListings(tinyHouses, filterText);
    updatedListings = sortListings(updatedListings, sortOrder);
    setFilteredListings(updatedListings);
  }, [tinyHouses, filterText, sortOrder]);

  // Buton tıklamasıyla daha fazla veri çek
  const handleLoadMore = () => {
    if (!isListingsLoading && hasMore) {
      const newOffset = offset + range;
      setOffset(newOffset);
      fetchTinyHousesByListingAmount(newOffset);
    }
  };

  return (
    <div className="listing-container">
      {filteredListings.length > 0 ? (
        filteredListings.map((house) => (
          <ProductCard 
            key={house.id}
            house={house}
            imageUrl={imagesMap[house.id]}
            
          />
        ))
      ) : (
        <p>No Tiny Houses Found</p>
      )}

     {hasMore && (
  <div className="load-more-container">
    <button
      onClick={handleLoadMore}
      disabled={isListingsLoading}
      className="load-more-btn"
    >
      {isListingsLoading ? "Loading..." : "Daha Fazla Yükle"}
    </button>
  </div>
)}
    </div>
  );
}
