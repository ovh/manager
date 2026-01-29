export const computeThresholdsFromMax = (max: number) => {
  if (max <= 0) return null;

  return {
    optimum: max * 0.7,
    low: max * 0.71,
    high: max * 0.9,
  };
};
