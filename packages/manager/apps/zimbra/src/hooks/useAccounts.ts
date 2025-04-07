import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  AccountType,
  getZimbraPlatformAccounts,
  getZimbraPlatformAccountsQueryKey,
} from '@/api/account';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseAccountsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  email?: string;
  domainId?: string;
  organizationId?: string;
  shouldFetchAll?: boolean;
};

export const useAccounts = (props: UseAccountsParams = {}) => {
  const { domainId, organizationId, email, shouldFetchAll, ...options } = props;
  const { platformId } = useParams();
  const [searchParams] = useSearchParams();

  const urlSearchParams = buildURLSearchParams({
    email,
    organizationId: organizationId ?? searchParams.get('organizationId'),
    domainId: domainId ?? searchParams.get('domainId'),
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformAccountsQueryKey(
      platformId,
      urlSearchParams,
      shouldFetchAll,
    ),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformAccounts({
        platformId,
        searchParams: urlSearchParams,
        pageParam,
        ...(shouldFetchAll ? { pageSize: APIV2_MAX_PAGESIZE } : {}),
      }),
    enabled: (q) =>
      (typeof options.enabled === 'function'
        ? options.enabled(q)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<AccountType[]>) => page.data,
      ),
  });

  useEffect(() => {
    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  return query;
};
