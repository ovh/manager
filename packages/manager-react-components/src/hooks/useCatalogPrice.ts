import { useTranslation } from 'react-i18next';
import { useMe } from './useMe';

const ASIA_FORMAT = ['SG', 'ASIA', 'AU', 'IN'];
const FRENCH_FORMAT = [
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

export interface CatalogPriceOptions {
  hideTaxLabel?: boolean;
  exclVat?: boolean;
}

/**
 * Handle the conversion on the frontend side from hourly price to monthly.
 * In the future, this conversion should be handled on the backend to improve efficiency and maintainability.
 * */
export const convertHourlyPriceToMonthly = (hourlyPrice: number) =>
  hourlyPrice * HOUR_IN_MONTH;

export const useCatalogPrice = (
  maximumFractionDigits?: number,
  options?: CatalogPriceOptions,
) => {
  const { i18n, t } = useTranslation('order-price');
  const { me } = useMe();

  const isTaxExcl =
    options?.exclVat ||
    [...ASIA_FORMAT, ...FRENCH_FORMAT, ...GERMAN_FORMAT].includes(
      me?.ovhSubsidiary,
    );

  const getTextPrice = (priceInCents: number) => {
    const priceToFormat = priceInCents / 100000000;
    const numberFormatOptions = {
      style: 'currency',
      currency: me?.currency?.code,
      ...(maximumFractionDigits ? { maximumFractionDigits } : {}),
    };
    return me
      ? new Intl.NumberFormat(
          i18n.language?.replace('_', '-'),
          numberFormatOptions as Parameters<typeof Intl.NumberFormat>[1],
        ).format(priceToFormat)
      : '';
  };

  const getFormattedCatalogPrice = (price: number): string =>
    `${
      isTaxExcl && !options?.hideTaxLabel
        ? t('order_catalog_price_tax_excl_label', {
            price: getTextPrice(price),
          })
        : getTextPrice(price)
    }`;

  const getFormattedHourlyCatalogPrice = (price: number) =>
    `${getFormattedCatalogPrice(price)} / ${t(
      `order_catalog_price_interval_hour`,
    )}`;

  const getFormattedMonthlyCatalogPrice = (price: number) =>
    `${getFormattedCatalogPrice(price)} / ${t(
      `order_catalog_price_interval_month`,
    )}`;

  return {
    getTextPrice,
    getFormattedCatalogPrice,
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  };
};
