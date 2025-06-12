// utils/listingUtils.js

export const filterListings = (listings, filterText) => {
  if (!filterText) return listings;

  return listings.filter(
    (listing) =>
      listing.name.toLowerCase().includes(filterText.toLowerCase()) ||
      listing.city.toLowerCase().includes(filterText.toLowerCase()) ||
      listing.country.toLowerCase().includes(filterText.toLowerCase())
  );
};

export const sortListings = (list, order) => {
  switch (order) {
    case "asc":
      return [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "desc":
      return [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "rate":
      return [...list].sort((a, b) => b.rating - a.rating);
    default:
      return list;
  }
};
