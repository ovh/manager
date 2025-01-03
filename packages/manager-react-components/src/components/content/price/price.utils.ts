import {
  OvhSubsidiary,
  IntervalUnitType,
  OVH_CURRENCY_BY_SUBSIDIARY,
} from '../../../enumTypes';

export interface PriceProps {
  /** The price value to display */
  value: number;
  /** The tax value to display */
  tax?: number;
  /** The interval unit for the price (day, month, year) */
  intervalUnit?: IntervalUnitType;
  /** The OVH subsidiary to determine price format */
  ovhSubsidiary: OvhSubsidiary;
  /** Whether to convert the price based on interval unit */
  isConvertIntervalUnit?: boolean;
  /** The locale for price formatting */
  locale: string;
  suffix?: string;
  isStartingPrice?: boolean;
}

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
