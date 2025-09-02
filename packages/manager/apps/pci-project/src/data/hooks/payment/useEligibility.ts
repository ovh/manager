import {
  queryOptions,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  checkVoucherEligibility,
  getEligibility,
} from '@/data/api/payment/eligibility';
import { TEligibilityRequiredAction } from '@/data/types/payment/eligibility.type';

export const eligibilityQueryKey = () => ['cloud', 'eligibility'];

export const eligibilityQueryOptions = () =>
  queryOptions({
    queryKey: eligibilityQueryKey(),
    queryFn: getEligibility,
  });

export const useEligibility = () => {
  return useQuery(eligibilityQueryOptions());
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

export const useIsAskIncreaseProjectsQuota = (): UseQueryResult<boolean> => {
  return useQuery({
    ...eligibilityQueryOptions(),
    select: (data) =>
      data?.actionsRequired?.includes(
        TEligibilityRequiredAction.ASK_INCREASE_PROJECTS_QUOTA,
      ) ?? false,
  });
};
