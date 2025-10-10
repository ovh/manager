export const ASIA_FORMAT = ['SG', 'ASIA', 'AU', 'IN'];
export const FRENCH_FORMAT = [
  'CZ',
  'ES',
  'FR',
  'GB',
  'IE',
  'IT',
  'LT',
  'MA',
  'NL',
  'PL',
  'PT',
  'TN',
];
export const GERMAN_FORMAT = ['DE', 'FI', 'SN'];
export const HOUR_IN_MONTH = 730;

export const priceToUcent = (price: number) => price * 100_000_000;
export const priceFromUcent = (price: number) => price / 100_000_000;

/**
 * Handle the conversion on the frontend side from hourly price to monthly.
 * In the future, this conversion should be handled on the backend to improve efficiency and maintainability.
 * */
export const convertHourlyPriceToMonthly = (hourlyPrice: number) =>
  hourlyPrice * HOUR_IN_MONTH;
