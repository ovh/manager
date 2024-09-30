import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  AccountType,
  getZimbraPlatformAccountDetail,
  getZimbraPlatformAccountDetailQueryKey,
} from '@/api/account';

type UseAccountParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn' | 'gcTime'
> & {
  accountId?: string;
  noCache?: boolean;
};

export const useAccount = (props: UseAccountParams) => {
  const { accountId, noCache, ...options } = props;
  const { platformId } = usePlatform();
  return useQuery({
    ...options,
    queryKey: getZimbraPlatformAccountDetailQueryKey(platformId, accountId),
    queryFn: () => getZimbraPlatformAccountDetail(platformId, accountId),
    enabled:
      (typeof options.enabled !== 'undefined' ? options.enabled : true) &&
      !!platformId &&
      !!accountId,
    gcTime: noCache ? 0 : 5000,
  }) as UseQueryResult<AccountType>;
};
