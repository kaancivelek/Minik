 const MAX_RATING=5;
 export const addStars = (rating) => {return "★".repeat(rating) + "☆".repeat(MAX_RATING - rating);};  