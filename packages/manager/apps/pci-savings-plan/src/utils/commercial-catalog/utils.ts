const MONTH_IN_YEAR = 12;
export const HOUR_IN_MONTH = 730;
export const CENTS_PRICE = 100000000;

export const convertToPrice = (price: number) =>
  price && !Number.isNaN(price) ? price / 100000000 : 0;

export const convertHourlyPriceToMonthly = (price: number) =>
  price * HOUR_IN_MONTH;

export const convertToDuration = (duration?: string) => {
  if (!duration) return 0;
  const value = parseInt(duration.replace('P', '').replace(/[MY]/, ''), 10);
  if (duration.includes('Y')) {
    return value * MONTH_IN_YEAR;
  }
  return value;
};
