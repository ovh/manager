import { QueryOptions, useQuery, useMutation } from '@tanstack/react-query';
import { addVoucher, buyCredit, BuyCreditResult } from '@/data/voucher';
import { getVouchers } from '@/data/vouchers';
import { Voucher } from '@/interface';

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

export const useVouchers = (projectId: string, opt?: QueryOptions<Voucher[]>) =>
  useQuery({
    queryKey: ['project', projectId, 'voucher'],
    queryFn: () => getVouchers(projectId),
    // refetchInterval: VOUCHERS_POLLING_INTERVAL,
    ...opt,
  });

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
