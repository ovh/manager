import { useCallback, useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  AccountType,
  getZimbraPlatformAccounts,
  getZimbraPlatformAccountsQueryKey,
} from '@/data/api';
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
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
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
    queryKey: getZimbraPlatformAccountsQueryKey(platformId, urlSearchParams, allPages),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformAccounts({
        platformId,
        searchParams: urlSearchParams,
        pageParam,
        disableCache: !!options.refetchInterval,
        ...(allPages ? { pageSize: APIV2_MAX_PAGESIZE } : {}),
      }),
    enabled: (q) =>
      (typeof options.enabled === 'function'
        ? options.enabled(q)
        : typeof options.enabled !== 'boolean' || options.enabled) && !!platformId,
    getNextPageParam: (lastPage: { cursorNext?: string }) => lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap((page: UseInfiniteQueryResult<AccountType[]>) => page.data),
  });

  const fetchAllPages = useCallback(() => {
    if (!allPages) {
      setAllPages(true);
    }
  }, [allPages, setAllPages]);

  useEffect(() => {
    if (allPages && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.data, allPages]);

  // reset when searchParams changes
  useEffect(() => {
    if (!shouldFetchAll) {
      setAllPages(false);
    }
  }, [urlSearchParams]);

  // use object assign instead of spread
  // to avoid unecessary rerenders
  return Object.assign(query, {
    fetchAllPages,
  });
};
