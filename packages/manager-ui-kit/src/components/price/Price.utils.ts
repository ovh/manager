import { DateIntervalOptions, OVH_CURRENCY_BY_SUBSIDIARY, OvhSubsidiary } from '@/commons';

import {
  ASIAN_FORMAT_SUBSIDIARIES,
  FRENCH_FORMAT_SUBSIDIARIES,
  GERMAN_FORMAT_SUBSIDIARIES,
  US_FORMAT_SUBSIDIARIES,
} from './Price.constants';

export const getPrice = (value: number, tax?: number): number => {
  const valueWithTax = tax ? value + tax : value;
  return valueWithTax / 100000000;
};

export const convertIntervalPrice = (price: number, intervalUnit: DateIntervalOptions): number => {
  const conversionRates = {
    [DateIntervalOptions.day]: price / 365,
    [DateIntervalOptions.month]: price / 12,
    [DateIntervalOptions.year]: price,
    [DateIntervalOptions.none]: price,
  };

  return conversionRates[intervalUnit] || price;
};

export const getPriceTextFormatted = (
  ovhSubsidiary: OvhSubsidiary,
  locale: string,
  priceValue: number,
): string => {
  try {
    return new Intl.NumberFormat(locale.replace('_', '-'), {
      style: 'currency',
      currency: OVH_CURRENCY_BY_SUBSIDIARY[ovhSubsidiary],
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceValue);
  } catch {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: OVH_CURRENCY_BY_SUBSIDIARY[ovhSubsidiary],
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceValue);
  }
};

export const checkAsianFormat = (subsidiary: string) => {
  return ASIAN_FORMAT_SUBSIDIARIES.includes(subsidiary);
};

export const checkGermanFormat = (subsidiary: string) => {
  return GERMAN_FORMAT_SUBSIDIARIES.includes(subsidiary);
};

export const checkFranceFormat = (subsidiary: string) => {
  return FRENCH_FORMAT_SUBSIDIARIES.includes(subsidiary);
};

export const checkUSFormat = (subsidiary: string) => {
  return US_FORMAT_SUBSIDIARIES.includes(subsidiary);
};
