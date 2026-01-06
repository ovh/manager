import { useQuery } from '@tanstack/react-query';

import { checkVoucherEligibility } from '@/data/api/eligibility';

const DISCOVERY_PROMOTION_VOUCHER = 'FREETRIAL';

export const discoveryVoucherQueryKey = () => [
  'cloud',
  'eligibility',
  'voucher',
  DISCOVERY_PROMOTION_VOUCHER,
];

export const useDiscoveryVoucher = (enabled = true) => {
  return useQuery({
    queryKey: discoveryVoucherQueryKey(),
    queryFn: async () => {
      const result = await checkVoucherEligibility(DISCOVERY_PROMOTION_VOUCHER);
      return result ?? null;
    },
    select: (data) => data?.credit?.text,
    enabled,
    retry: false,
  });
};
