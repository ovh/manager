import { useMemo } from 'react';
import { useProjectCredit } from '@/data/hooks/useProjectCredit/useProjectCredit';

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
