export const filterListings = (listings, filterText) => {
  if (!filterText) return listings;

  return listings.filter(
    (listing) =>
      listing.name.toLowerCase().includes(filterText.toLowerCase()) ||
      listing.city.toLowerCase().includes(filterText.toLowerCase()) ||
      listing.country.toLowerCase().includes(filterText.toLowerCase())
  );
};