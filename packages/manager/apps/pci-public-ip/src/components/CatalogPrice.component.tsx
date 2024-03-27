import { useTranslation } from 'react-i18next';
import { IMe } from '@/api/hooks/useMe';

export const CatalogPriceComponent = ({
  price,
  user,
  interval,
  maximumFractionDigits,
  locale,
}: {
  price: number;
  user: IMe;
  interval: string;
  maximumFractionDigits?: number;
  locale: string;
}): JSX.Element => {
  const { t } = useTranslation('price');
  const isFrenchFormat = true;

  const getTextPrice = (priceInCents: number) => {
    const priceToFormat = priceInCents / 100000000;
    const numberFormatOptions = {
      style: 'currency',
      currency: user?.currency.code,
      ...(maximumFractionDigits ? { maximumFractionDigits } : {}),
    };
    return new Intl.NumberFormat(
      locale.replace('_', '-'),
      numberFormatOptions,
    ).format(priceToFormat);
  };

  return (
    <span>
      {isFrenchFormat && (
        <strong>
          <span>
            {t('order_catalog_price_tax_excl_label', {
              price: getTextPrice(price),
            })}
          </span>
          {interval && (
            <span>&nbsp;/ {t(`order_catalog_price_interval_${interval}`)}</span>
          )}
        </strong>
      )}
    </span>
  );
};
