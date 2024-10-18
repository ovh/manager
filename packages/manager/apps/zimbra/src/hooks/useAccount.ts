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
};

export const useAccount = (props: UseAccountParams) => {
  const { accountId, ...options } = props;
  const { platformId } = usePlatform();
  return useQuery({
    ...options,
    queryKey: getZimbraPlatformAccountDetailQueryKey(platformId, accountId),
    queryFn: () => getZimbraPlatformAccountDetail(platformId, accountId),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!accountId,
  }) as UseQueryResult<AccountType>;
};
