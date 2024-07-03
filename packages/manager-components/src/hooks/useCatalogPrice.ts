import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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

export interface CatalogPriceOptions {
  hideTaxLabel?: boolean;
}

export const useCatalogPrice = (
  maximumFractionDigits?: number,
  options?: CatalogPriceOptions,
) => {
  const { t } = useTranslation('order-price');
  const { me } = useMe();

  const locale = useContext(ShellContext).environment.getUserLocale();
  const isTaxExcl = [...ASIA_FORMAT, ...FRENCH_FORMAT].includes(
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
          locale.replace('_', '-'),
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
