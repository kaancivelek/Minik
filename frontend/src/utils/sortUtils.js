export const sortListings = (list, order) => {
  switch (order) {
    case "asc":
      return [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "desc":
      return [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "rate":
      return [...list].sort((a, b) => b.rating - a.rating);
    default:
      return list; // Varsayılan olarak sıralama yapma
  }
};