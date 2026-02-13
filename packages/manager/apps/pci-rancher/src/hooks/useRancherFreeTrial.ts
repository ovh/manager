import { priceToUcent, useCatalogPrice } from '@ovh-ux/muk';
import { useMemo } from 'react';

// Todo : try to get this from the credit API
const FREE_TRIAL_CREDIT_OVH_EDITION = priceToUcent(100);
const FREE_TRIAL_CREDIT_STANDARD = priceToUcent(250);

export const useRancherFreeTrial = () => {
  const { getTextPrice } = useCatalogPrice(0);

  return useMemo(() => {
    return {
      ovhEdition: getTextPrice(FREE_TRIAL_CREDIT_OVH_EDITION),
      standard: getTextPrice(FREE_TRIAL_CREDIT_STANDARD),
    };
  }, [getTextPrice]);
};
