import { UseQueryResult, queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { checkVoucherEligibility, getEligibility } from '@/data/api/eligibility';
import { TEligibilityRequiredAction, TEligibilityVoucher } from '@/data/models/Eligibility.type';

type ApiError = AxiosError<{ message: string }>;

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
  onSuccess?: (data: TEligibilityVoucher | undefined) => void;
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
      data?.actionsRequired?.includes(TEligibilityRequiredAction.ASK_INCREASE_PROJECTS_QUOTA) ??
      false,
  });
};
