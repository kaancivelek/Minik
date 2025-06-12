export const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$1 ");
};

export const formatExpiryDate = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(?=\d)/, "$1/");
};