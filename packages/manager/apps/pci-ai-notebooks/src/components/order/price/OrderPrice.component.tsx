import { useTranslation } from 'react-i18next';
import Price from '@/components/price/Price.component';
import { order } from '@/types/catalog';

interface OrderPriceProps {
  minuteConverter: number;
  price: order.publicOrder.Pricing;
  quantity: number;
}
const OrderPrice = ({ minuteConverter, price, quantity }: OrderPriceProps) => {
  const { t } = useTranslation('pricing');
  return (
    <div
      data-testid="order-price-container"
      className="flex justify-between items-baseline gap-2"
    >
      <span>{t('pricingLabel')}</span>
      <div className="inline-block">
        <Price
          decimals={2}
          priceInUcents={minuteConverter * quantity * price.price}
          taxInUcents={minuteConverter * quantity * price.tax}
          displayInHour={true}
        />
      </div>
    </div>
  );
};

export default OrderPrice;
