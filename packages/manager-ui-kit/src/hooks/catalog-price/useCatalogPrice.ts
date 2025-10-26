import { useTranslation } from 'react-i18next';

import { ASIA_FORMAT, FRENCH_FORMAT, GERMAN_FORMAT } from '@/hooks/catalog-price/Catalog.constants';
import { CatalogPriceOptions } from '@/hooks/catalog-price/Catalog.type';
import { priceFromUcent } from '@/hooks/catalog-price/Catalog.utils';
import { useMe } from '@/hooks/me/useMe';

export const useCatalogPrice = (maximumFractionDigits?: number, options?: CatalogPriceOptions) => {
  const { i18n, t } = useTranslation('order-price');
  const { me } = useMe();

  const isFrench = me?.ovhSubsidiary ? FRENCH_FORMAT.includes(me.ovhSubsidiary) : false;
  const isAsia = me?.ovhSubsidiary ? ASIA_FORMAT.includes(me.ovhSubsidiary) : false;
  const isGerman = me?.ovhSubsidiary ? GERMAN_FORMAT.includes(me.ovhSubsidiary) : false;
  const isTaxExcl = options?.exclVat || isAsia || isFrench || isGerman;

  const getTextPrice = (priceInCents: number) => {
    const priceToFormat = priceFromUcent(priceInCents);
    const numberFormatOptions = {
      style: 'currency',
      currency: me?.currency?.code,
      ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
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
    `${getFormattedCatalogPrice(price)} / ${t(`order_catalog_price_interval_hour`)}`;

  const getFormattedMonthlyCatalogPrice = (price: number) =>
    `${getFormattedCatalogPrice(price)} / ${t(`order_catalog_price_interval_month`)}`;

  return {
    getTextPrice,
    getFormattedCatalogPrice,
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  };
};
