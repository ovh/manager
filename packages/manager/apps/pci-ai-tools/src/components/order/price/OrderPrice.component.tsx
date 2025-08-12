import { useTranslation } from 'react-i18next';
import Price from '@/components/price/Price.component';
import publicCatalog from '@/types/Catalog';

interface OrderPriceProps {
  minuteConverter: number;
  price: publicCatalog.Pricing;
  quantity: number;
  section?: string;
  showPriceLabel?: boolean;
}
const OrderPrice = ({
  minuteConverter,
  price,
  quantity,
  section,
  showPriceLabel = true,
}: OrderPriceProps) => {
  const { t } = useTranslation('ai-tools/pricing');
  return (
    <div data-testid="order-price-container" className="flex flex-col gap-2">
      {showPriceLabel && <p>{t('pricingLabel')}</p>}
      <div className="inline-block">
        <span className="font-bold">{section}</span>
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
