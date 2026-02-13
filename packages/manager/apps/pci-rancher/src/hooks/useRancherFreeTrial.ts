import { priceToUcent, useCatalogPrice } from '@ovh-ux/muk';
import { useMemo } from 'react';
import { useProjectCredit } from '@/data/hooks/useProjectCredit/useProjectCredit';

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

const rancherFreeTrialVoucherIdPrefix = 'rancher-freetrial';

export const useRancherFreeTrialVoucher = () => {
  const { data: credit } = useProjectCredit();

  const freeTrialVoucher = useMemo(
    () =>
      credit?.find(
        (voucher) =>
          voucher.voucher.startsWith(rancherFreeTrialVoucherIdPrefix) &&
          voucher.available_credit.value > 0,
      ),
    [credit],
  );

  return freeTrialVoucher;
};
