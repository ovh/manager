import { useTranslation } from 'react-i18next';
import Price from '@/components/price';
import { Span } from '@/components/typography';

interface OrderPriceProps {
  showMonthly: boolean;
  prices: {
    hourly: {
      price: number;
      tax: number;
    };
    monthly: {
      price: number;
      tax: number;
    };
  };
}
const OrderPrice = ({ showMonthly, prices }: OrderPriceProps) => {
  const { t } = useTranslation('pricing');
  const decimals = showMonthly ? 2 : 3;
  const unit = showMonthly ? 'monthly' : 'hourly';
  const price = prices[unit];
  return (
    <div className="flex justify-between items-baseline gap-2">
      <Span>{t('pricing_label')}</Span>
      <div className="inline-block">
        <Price
          decimals={decimals}
          priceInUcents={price.price}
          taxInUcents={price.tax}
        />{' '}
        <Span className="font">{t(`pricing_unit_${unit}`)}</Span>
      </div>
    </div>
  );
};

export default OrderPrice;
