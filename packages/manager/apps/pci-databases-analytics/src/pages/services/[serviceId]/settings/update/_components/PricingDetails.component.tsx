import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@datatr-ux/uxlib';
import { ServicePricing } from '@/lib/pricingHelper';
import * as database from '@/types/cloud/project/database';
import Price from '@/components/price/Price.component';

interface PrincingDetailsProps {
  service: database.Service;
  pricing: ServicePricing;
  showMonthly?: boolean;
}
const PricingDetails = ({
  service,
  pricing,
  showMonthly = false,
}: PrincingDetailsProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  return (
    <Popover>
      <PopoverTrigger>
        <HelpCircle className="w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-auto" side="top">
        <p>
          {t('pricingDetailsNodes')}&nbsp;<span>{service.nodes.length}</span>
        </p>
        <p>
          {t('pricingDetailsFlavor')}&nbsp;
          <Price
            className="inline"
            priceInUcents={
              pricing.flavorPrice[showMonthly ? 'monthly' : 'hourly'].price
            }
            taxInUcents={
              pricing.flavorPrice[showMonthly ? 'monthly' : 'hourly'].tax
            }
            decimals={showMonthly ? 2 : 3}
          />
        </p>
        <p>
          {t('pricingDetailsStorage')}&nbsp;
          <Price
            className="inline"
            priceInUcents={
              pricing.storagePrice[showMonthly ? 'monthly' : 'hourly'].price
            }
            taxInUcents={
              pricing.storagePrice[showMonthly ? 'monthly' : 'hourly'].tax
            }
            decimals={showMonthly ? 2 : 3}
          />
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default PricingDetails;
