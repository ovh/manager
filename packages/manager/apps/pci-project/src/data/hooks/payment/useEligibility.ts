import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  checkVoucherEligibility,
  getEligibility,
} from '@/data/api/payment/eligibility';

export const eligibilityQueryKey = () => ['cloud', 'eligibility'];

export const useEligibility = () => {
  return useQuery({
    queryKey: eligibilityQueryKey(),
    queryFn: getEligibility,
  });
};

export const useCheckVoucherEligibility = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}) =>
  useMutation({
    mutationFn: (voucher: string) => checkVoucherEligibility(voucher),
    onSuccess,
    onError,
  });
