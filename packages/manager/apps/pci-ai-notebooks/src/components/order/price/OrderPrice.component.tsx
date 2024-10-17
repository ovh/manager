import { useTranslation } from 'react-i18next';
import Price from '@/components/price/Price.component';
import { order } from '@/types/catalog';

interface OrderPriceProps {
  price: order.publicOrder.Pricing;
  quantity: number;
}
const OrderPrice = ({ price, quantity }: OrderPriceProps) => {
  const { t } = useTranslation('pricing');
  return (
    <div
      data-testid="order-price-container"
      className="flex justify-between items-baseline gap-2"
    >
      <span>{t('pricing_label')}</span>
      <div className="inline-block">
        <Price
          decimals={2}
          priceInUcents={quantity * price.price}
          taxInUcents={quantity * price.tax}
        />
      </div>
    </div>
  );
};

export default OrderPrice;
