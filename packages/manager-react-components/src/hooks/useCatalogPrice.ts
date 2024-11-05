import { useTranslation } from 'react-i18next';
import { useMe } from './useMe';

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

export interface CatalogPriceOptions {
  hideTaxLabel?: boolean;
  exclVat?: boolean;
}

export const priceToUcent = (price: number) => price * 100_000_000;
export const priceFromUcent = (price: number) => price / 100_000_000;

export const useCatalogPrice = (
  maximumFractionDigits?: number,
  options?: CatalogPriceOptions,
) => {
  const { i18n, t } = useTranslation('order-price');
  const { me } = useMe();

  const isFrench = FRENCH_FORMAT.includes(me?.ovhSubsidiary);
  const isAsia = ASIA_FORMAT.includes(me?.ovhSubsidiary);
  const isGerman = GERMAN_FORMAT.includes(me?.ovhSubsidiary);
  const isTaxExcl = options?.exclVat || isAsia || isFrench || isGerman;

  const getTextPrice = (priceInCents: number) => {
    const priceToFormat = priceFromUcent(priceInCents);
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
    isTaxExcl && !options?.hideTaxLabel && !isGerman
      ? t('order_catalog_price_tax_excl_label', {
          price: getTextPrice(price),
        })
      : getTextPrice(price);

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
