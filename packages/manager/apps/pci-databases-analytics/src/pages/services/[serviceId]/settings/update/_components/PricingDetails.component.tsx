import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@datatr-ux/uxlib';
import { ServicePricing } from '@/lib/pricingHelper';
import * as database from '@/types/cloud/project/database';
import Price from '@/components/price/Price.component';

interface PrincingDetailsProps {
  service: database.Service;
  pricing: ServicePricing;
}
const PricingDetails = ({ service, pricing }: PrincingDetailsProps) => {
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
            priceInUcents={pricing.flavorPrice.price}
            taxInUcents={pricing.flavorPrice.tax}
            decimals={3}
          />
        </p>
        <p>
          {t('pricingDetailsStorage')}&nbsp;
          <Price
            className="inline"
            priceInUcents={pricing.storagePrice.price}
            taxInUcents={pricing.storagePrice.tax}
            decimals={3}
          />
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default PricingDetails;
