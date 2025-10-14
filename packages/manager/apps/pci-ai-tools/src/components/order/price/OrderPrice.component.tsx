import { useTranslation } from 'react-i18next';
import Price from '@/components/price/Price.component';
import publicCatalog from '@/types/Catalog';

interface OrderPriceProps {
  price: publicCatalog.Pricing;
  quantity: number;
  section?: string;
  showPriceLabel?: boolean;
  isQPU?: boolean;
  minuteConverter?: number;
}
const OrderPrice = ({
  price,
  quantity,
  section,
  showPriceLabel = true,
  isQPU = false,
  minuteConverter,
}: OrderPriceProps) => {
  const { t } = useTranslation('ai-tools/pricing');

  // Conversion factor : Notebook minuteConverter, QPU : 3600s/h
  const conversionFactor = isQPU ? 3600 : minuteConverter;

  const priceInUcents = quantity * conversionFactor * (price.price || 0);
  const taxInUcents = quantity * conversionFactor * (price.tax || 0);

  return (
    <div data-testid="order-price-container" className="flex flex-col gap-2">
      {showPriceLabel && <p>{t('pricingLabel')}</p>}
      <div className="inline-block">
        <span className="font-bold">{section}</span>
        <Price
          priceInUcents={priceInUcents}
          taxInUcents={taxInUcents}
          decimals={2}
          displayInHour={true}
        />
      </div>
    </div>
  );
};

export default OrderPrice;
