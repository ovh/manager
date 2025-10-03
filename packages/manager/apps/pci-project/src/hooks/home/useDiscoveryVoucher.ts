import { useQuery } from '@tanstack/react-query';
import { checkVoucherEligibility } from '@/data/api/payment/eligibility';

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
    queryFn: () => checkVoucherEligibility(DISCOVERY_PROMOTION_VOUCHER),
    select: (data) => data?.credit?.text,
    enabled,
  });
};
