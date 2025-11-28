import { useTranslation } from 'react-i18next';
import { Separator } from '@datatr-ux/uxlib';
import Price from '@/components/price/Price.component';
import { ServicePricing } from '@/lib/pricingHelper';

interface TablePriceProps {
  prices: ServicePricing;
}
const OfferPricing = ({ prices }: TablePriceProps) => {
  const { t } = useTranslation('pricing');

  return (
    <div data-testid="table-price-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-center text-xs">
        <div className="align-top">{t('pricing_instance_label')}</div>
        <div className="flex justify-end items-center flex-wrap gap-2">
          <Price
            className="flex justify-end items-center flex-wrap gap-2"
            decimals={3}
            priceInUcents={prices.flavorPrice.hourly.price}
            taxInUcents={prices.flavorPrice.hourly.tax}
          />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-center text-xs">
        <div className="align-top">{t('pricing_storage_label')}</div>
        <div className="flex justify-end items-center flex-wrap gap-2">
          <Price
            className="flex justify-end items-center flex-wrap gap-2"
            decimals={3}
            priceInUcents={prices.storagePrice.hourly.price}
            taxInUcents={prices.storagePrice.hourly.tax}
          />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-center">
        <div className="font-semibold text-text align-top min-w-[110px]">
          {t('total_hour_label')}
        </div>
        <div className="flex justify-end items-center flex-wrap gap-2">
          <Price
            className="flex justify-end items-center flex-wrap gap-2"
            decimals={3}
            priceInUcents={prices.servicePrice.hourly.price}
            taxInUcents={prices.servicePrice.hourly.tax}
          />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-center text-xs text-gray-500 italic">
        <div className="align-top">{t('estimated_month_label')}</div>
        <div className="flex justify-end items-center flex-wrap gap-2">
          <Price
            className="flex justify-end items-center flex-wrap gap-2"
            decimals={0}
            priceInUcents={prices.servicePrice.monthly.price}
            taxInUcents={prices.servicePrice.monthly.tax}
          />
        </div>
      </div>
    </div>
  );
};

export default OfferPricing;
