import { useParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import {
  AccountType,
  getZimbraPlatformAccountDetail,
  getZimbraPlatformAccountDetailQueryKey,
} from '@/data/api';

type UseAccountParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  accountId?: string;
};

export const useAccount = (props: UseAccountParams = {}) => {
  const { accountId: paramId, ...options } = props;
  const { platformId, accountId } = useParams();
  const id = paramId || accountId;
  return useQuery({
    ...options,
    queryKey: getZimbraPlatformAccountDetailQueryKey(platformId, id),
    queryFn: () => getZimbraPlatformAccountDetail(platformId, id),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!id &&
      !!platformId,
  }) as UseQueryResult<AccountType>;
};
