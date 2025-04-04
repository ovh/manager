import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  AccountType,
  getZimbraPlatformAccounts,
  getZimbraPlatformAccountsQueryKey,
} from '@/api/account';
import { APIV2_MAX_PAGESIZE } from '@/utils';
import {
  useInfiniteQueryWithFetchAllPages,
  UseInfiniteQueryWithFetchAllPagesOptions,
} from './useInfiniteQueryWithFetchAllPages';

type UseAccountsParams = Omit<
  UseInfiniteQueryWithFetchAllPagesOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  email?: string;
  domainId?: string;
  organizationId?: string;
};

export const useAccounts = (props: UseAccountsParams = {}) => {
  const { domainId, organizationId, email, ...options } = props;
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();

  return useInfiniteQueryWithFetchAllPages({
    ...options,
    searchParams: {
      email,
      organizationId: organizationId ?? searchParams.get('organizationId'),
      domainId: domainId ?? searchParams.get('domainId'),
    },
    queryKey: getZimbraPlatformAccountsQueryKey(platformId),
    queryFn: ({ pageParam, allPages, urlSearchParams }) =>
      getZimbraPlatformAccounts({
        platformId,
        searchParams: urlSearchParams,
        pageParam,
        ...(allPages ? { pageSize: APIV2_MAX_PAGESIZE } : {}),
      }),
    enabled: (q) =>
      (typeof options.enabled === 'function'
        ? options.enabled(q)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId,
    initialPageParam: null,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<AccountType[]>) => page.data,
      ),
  });
};
