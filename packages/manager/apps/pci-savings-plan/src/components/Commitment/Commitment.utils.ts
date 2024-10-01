export const getDiffInPercent = (price1: number, price2: number) => {
  return price1 ? Math.floor(((price1 - price2) / price1) * 100).toFixed(0) : 0;
};
