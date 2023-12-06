import { QueryOptions, useQuery, useMutation } from '@tanstack/react-query';
import { getVouchers } from '@/data/vouchers';
import { Voucher } from '@/interface';
import { addVoucher } from '@/data/voucher';

type Props = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export function useAddVoucher({ projectId, onError, onSuccess }: Props) {
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

export default {
  useAddVoucher,
  useVouchers,
};
