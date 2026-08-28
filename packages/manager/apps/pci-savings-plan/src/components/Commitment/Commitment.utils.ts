export const getDiffInPercent = (
  referencePrice: number,
  discountedPrice: number,
) => {
  if (referencePrice === 0 || discountedPrice === 0) {
    return null;
  }

  return String(
    Math.round(((referencePrice - discountedPrice) / referencePrice) * 100),
  );
};
