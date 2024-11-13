import { useTranslation } from 'react-i18next';
import { IMe } from '@/api/hooks/useMe';

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
  const { t } = useTranslation('order-price');
  const isTaxExcl = [...ASIA_FORMAT, ...FRENCH_FORMAT].includes(
    user.ovhSubsidiary,
  );

  const getTextPrice = (priceInCents: number) => {
    const priceToFormat = priceInCents / 100000000;
    const numberFormatOptions: Intl.NumberFormatOptions = {
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
      <strong>
        <span>
          {isTaxExcl &&
            t('order_catalog_price_tax_excl_label', {
              price: getTextPrice(price),
            })}
          {!isTaxExcl && <span>{getTextPrice(price)}</span>}
        </span>
        {interval && (
          <span>&nbsp;/ {t(`order_catalog_price_interval_${interval}`)}</span>
        )}
      </strong>
    </span>
  );
};
