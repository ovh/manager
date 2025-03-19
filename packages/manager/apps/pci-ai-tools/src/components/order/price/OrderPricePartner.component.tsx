import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import Price from '@/components/price/Price.component';
import { AppPricing } from '@/types/orderFunnel';

interface PartnerOrderPriceProps {
  isCpu: boolean;
  licencingType: ai.capabilities.LicensingTypeEnum;
  minuteConverter: number;
  price: AppPricing;
  quantity: number;
}
const ParnterOrderPrice = ({
  isCpu,
  licencingType,
  minuteConverter,
  price,
  quantity,
}: PartnerOrderPriceProps) => {
  const { t } = useTranslation('ai-tools/pricing');
  return (
    <div
      data-testid="order-price-container"
      className="flex justify-between items-baseline gap-2"
    >
      <div className="inline-block text-sm">
        {isCpu ? (
          <span>{t('licenceCpuPriceLabel')} </span>
        ) : (
          <span>{t('licenceGpuPriceLabel')} </span>
        )}
        {licencingType !==
          ai.capabilities.LicensingTypeEnum['per-second-bracket'] && (
          <span>{t('licenceFromLabel')} </span>
        )}
        <Price
          decimals={2}
          priceInUcents={minuteConverter * quantity * price.price}
          taxInUcents={minuteConverter * quantity * price.tax}
          displayInHour={false}
        />
        {licencingType !==
        ai.capabilities.LicensingTypeEnum['per-second-bracket'] ? (
          <span> {t('partnerPriceSuffix')}</span>
        ) : (
          <span> {t('partnerPricePerUsageSuffix')}</span>
        )}
      </div>
    </div>
  );
};

export default ParnterOrderPrice;
