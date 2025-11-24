import { useTranslation } from 'react-i18next';

import { OdsMessage, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { OvhSubsidiary, Price } from '@ovh-ux/manager-react-components';

import { useOkmsPricing } from '@/common/components/price-tile/useOkmsPricing';
import { useShellContext } from '@/common/hooks/useShellContext';

import { PricingProductCode } from './pricingTile.type';

type PriceTileProps = {
  productCode: PricingProductCode;
};

export const PriceTilePrice = ({ productCode }: PriceTileProps) => {
  const { ovhSubsidiary } = useShellContext().environment.getUser();
  const userLocale = useShellContext().environment.getUserLocale();
  const { t } = useTranslation('common');

  const { pricingData, isPending, isError } = useOkmsPricing({ productCode });

  if (isPending) {
    return <OdsSkeleton />;
  }

  if (isError) {
    return (
      <OdsMessage color="danger" isDismissible={false}>
        {t('error_fetching_data')}
      </OdsMessage>
    );
  }

  return (
    <Price
      value={pricingData.price}
      tax={pricingData.tax}
      ovhSubsidiary={OvhSubsidiary[ovhSubsidiary as keyof typeof OvhSubsidiary]}
      locale={userLocale}
      intervalUnit={pricingData.intervalUnit}
    />
  );
};
