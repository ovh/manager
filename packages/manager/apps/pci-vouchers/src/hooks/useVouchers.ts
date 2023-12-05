import { QueryOptions, useQuery } from '@tanstack/react-query';
import { getVouchers } from '@/data/vouchers';
import { Voucher } from '@/interface';

// const VOUCHERS_POLLING_INTERVAL = 5000;

export const useVouchers = (projectId: string, opt?: QueryOptions<Voucher[]>) =>
  useQuery({
    queryKey: ['project', projectId, 'voucher'],
    queryFn: () => getVouchers(projectId),
    // refetchInterval: VOUCHERS_POLLING_INTERVAL,
    ...opt,
  });

export default useVouchers;
