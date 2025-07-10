import {
  OvhSubsidiary,
  IntervalUnitType,
  OVH_CURRENCY_BY_SUBSIDIARY,
} from '../../enumTypes';
import {
  ASIAN_FORMAT_SUBSIDIARIES,
  GERMAN_FORMAT_SUBSIDIARIES,
  FRENCH_FORMAT_SUBSIDIARIES,
  US_FORMAT_SUBSIDIARIES,
} from './Price.constants';

export const getPrice = (value: number, tax?: number): number => {
  const valueWithTax = tax ? value + tax : value;
  return valueWithTax / 100000000;
};

export const convertIntervalPrice = (
  price: number,
  intervalUnit: IntervalUnitType,
): number => {
  const conversionRates = {
    [IntervalUnitType.day]: price / 365,
    [IntervalUnitType.month]: price / 12,
    [IntervalUnitType.year]: price,
    [IntervalUnitType.none]: price,
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
  } catch (e) {
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
