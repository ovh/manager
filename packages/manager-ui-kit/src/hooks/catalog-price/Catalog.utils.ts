import { HOUR_IN_MONTH } from '@/hooks/catalog-price/Catalog.constants';

export const priceToUcent = (price: number) => price * 100_000_000;
export const priceFromUcent = (price: number) => price / 100_000_000;
export const convertHourlyPriceToMonthly = (hourlyPrice: number) => hourlyPrice * HOUR_IN_MONTH;
