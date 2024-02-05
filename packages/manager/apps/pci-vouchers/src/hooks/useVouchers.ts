import { useMutation, useQuery } from '@tanstack/react-query';
import { addVoucher, buyCredit, BuyCreditResult } from '@/data/voucher';
import {
  filterVouchers,
  getAllVouchers,
  paginateResults,
  VouchersOptions,
} from '@/data/vouchers';

type AddVoucherProps = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export function useAddVoucher({
  projectId,
  onError,
  onSuccess,
}: AddVoucherProps) {
  const mutation = useMutation({
    mutationFn: (code: string) => {
      return addVoucher(`${projectId}`, code);
    },
    onError,
    onSuccess,
  });

  return {
    add: (code: string) => {
      return mutation.mutate(code);
    },
    ...mutation,
  };
}

// const VOUCHERS_POLLING_INTERVAL = 5000;

export const useAllVouchers = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'voucher'],
    queryFn: () => getAllVouchers(projectId),
    retry: false,
    // refetchInterval: VOUCHERS_POLLING_INTERVAL,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useVouchers = (
  projectId: string,
  { pagination, sorting }: VouchersOptions,
) => {
  // retrieve All vouchers from API
  const {
    data: vouchers,
    error: allVouchersError,
    isLoading: allVouchersLoading,
  } = useAllVouchers(projectId);

  // filtering Vouchers
  const { data: filteredVouchers } = useQuery({
    queryKey: ['project', projectId, 'vouchers', sorting],
    queryFn: () => filterVouchers(vouchers || [], sorting),
    enabled: !!vouchers,
  });

  // paginate results
  const { isLoading, error, data } = useQuery({
    queryKey: ['project', projectId, 'vouchers', sorting, pagination],
    queryFn: () => paginateResults(filteredVouchers || [], pagination),
    enabled: !!filteredVouchers,
  });

  return {
    isLoading: allVouchersLoading || isLoading,
    error: allVouchersError || error,
    data,
  };
};

export type BuyCreditProps = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: (result: BuyCreditResult) => void;
};

export function useBuyCredit({
  projectId,
  onError,
  onSuccess,
}: BuyCreditProps) {
  const mutation = useMutation({
    mutationFn: (amount: number) => {
      return buyCredit(`${projectId}`, amount);
    },
    onError,
    onSuccess,
  });

  return {
    buy: (amount: number) => {
      return mutation.mutate(amount);
    },
    ...mutation,
  };
}

export default {
  useAddVoucher,
  useBuyCredit,
  useVouchers,
};
