import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';

interface PriceProps {
  priceInUcents: number;
  taxInUcents: number;
  decimals: number;
  displayInHour: boolean;
}
const Price = ({
  priceInUcents,
  taxInUcents,
  decimals = 2,
  displayInHour = true,
}: PriceProps) => {
  const { t } = useTranslation('pricing');
  const catalog = useGetCatalog();
  const locale = useLocale();

  if (!catalog.isSuccess) {
    return (
      <span
        data-testid="pricing-skeleton"
        className="animate-pulse rounded-md bg-muted w-40"
      />
    );
  }

  const ucentToEur = 100_000_000;
  const price = priceInUcents / ucentToEur;
  const priceWithTax = (priceInUcents + taxInUcents) / ucentToEur;
  const formatPrice = (value: number) => {
    const formatter = new Intl.NumberFormat(locale.replace('_', '-'), {
      style: 'currency',
      currency: catalog.data.locale.currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return formatter.format(value);
  };

  return (
    <>
      <span data-testid="pricing-ht" className="font-bold">
        {t('pricingHt', { price: formatPrice(price) })}
      </span>{' '}
      {displayInHour && <span>{t('pricingInHour')}</span>}{' '}
      <span data-testid="pricing-ttc">
        ({t('pricingTtc', { price: formatPrice(priceWithTax) })})
      </span>
    </>
  );
};

export default Price;
