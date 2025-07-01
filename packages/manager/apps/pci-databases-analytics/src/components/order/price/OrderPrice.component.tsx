import { useTranslation } from 'react-i18next';
import { ServicePricing } from '@/lib/pricingHelper';
import * as database from '@/types/cloud/project/database';
import FreeBetaPricing from '../../price/FreeBetaPricing.component';
import OfferPricing from './OfferPricing.component';

interface OrderPriceProps {
  availability: database.Availability;
  prices: ServicePricing;
}
const OrderPrice = ({ availability, prices }: OrderPriceProps) => {
  const { t } = useTranslation('pricing');
  const isFreeBeta =
    prices.servicePrice.hourly.price === 0 &&
    availability.lifecycle.status === 'BETA';

  return (
    <div data-testid="order-price-container">
      <p className="font-bold">{t('pricing_label')}</p>
      {isFreeBeta ? (
        <FreeBetaPricing popoverSide="left" />
      ) : (
        <OfferPricing prices={prices} />
      )}
    </div>
  );
};
export default OrderPrice;
