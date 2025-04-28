export const UCENTS_FACTOR = 100000000;

export const convertUcentsToCurrency = (value: number, interval = 1) =>
  value / interval / UCENTS_FACTOR;
