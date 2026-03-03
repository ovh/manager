import { useTranslation } from 'react-i18next';

import { Message, Skeleton } from '@ovhcloud/ods-react';

import { OvhSubsidiary, Price } from '@ovh-ux/muk';

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
    return <Skeleton />;
  }

  if (isError) {
    return (
      <Message color="critical" dismissible={false}>
        {t('error_fetching_data')}
      </Message>
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
