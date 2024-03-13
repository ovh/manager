import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addVoucher, buyCredit, BuyCreditResult } from '@/data/voucher';
import {
  filterVouchers,
  getAllVouchers,
  paginateResults,
  VouchersOptions,
} from '@/data/vouchers';
import queryClient from '@/queryClient';

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'vouchers'],
      });
      onSuccess();
    },
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
    queryKey: ['project', projectId, 'vouchers'],
    queryFn: () => getAllVouchers(projectId),
    retry: false,
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

  return useMemo(() => {
    return {
      isLoading: allVouchersLoading,
      error: allVouchersError,
      data: paginateResults(
        filterVouchers(vouchers || [], sorting),
        pagination,
      ),
    };
  }, [vouchers, sorting, pagination]);
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
