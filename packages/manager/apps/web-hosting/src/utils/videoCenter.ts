export const computeThresholdsFromMax = (max: number) => {
  if (max <= 0) return null;

  return {
    optimum: Math.round(max * 0.7),
    low: Math.round(max * 0.71),
    high: Math.round(max * 0.9),
  };
};
