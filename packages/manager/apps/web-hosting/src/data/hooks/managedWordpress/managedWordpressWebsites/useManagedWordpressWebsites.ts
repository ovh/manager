import { useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  getManagedCmsResourceWebsites,
  getManagedCmsResourceWebsitesQueryKey,
} from '@/data/api/managedWordpress';
import { ManagedWordpressWebsites } from '@/data/types/product/managedWordpress/website';
import {
  APIV2_MAX_PAGESIZE,
  DATAGRID_REFRESH_INTERVAL,
  DATAGRID_REFRESH_ON_MOUNT,
  buildURLSearchParams,
} from '@/utils';

type UseManagedWordpressWebsitesParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  defaultFQDN?: string;
  shouldFetchAll?: boolean;
  disableRefetchInterval?: boolean;
};

export const useManagedWordpressWebsites = (props: UseManagedWordpressWebsitesParams = {}) => {
  const { defaultFQDN, shouldFetchAll, disableRefetchInterval, ...options } = props;
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
  const { serviceName } = useParams();
  const searchParams = useMemo(() => buildURLSearchParams({ defaultFQDN }), [defaultFQDN]);
  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getManagedCmsResourceWebsitesQueryKey(serviceName, searchParams, allPages),
    queryFn: ({ pageParam }) =>
      getManagedCmsResourceWebsites({
        serviceName: serviceName,
        pageParam: pageParam as string,
        searchParams,
        ...(allPages ? { pageSize: APIV2_MAX_PAGESIZE } : {}),
      }),
    enabled: (q) =>
      typeof props.enabled === 'function'
        ? props.enabled(q)
        : typeof props.enabled !== 'boolean' || props.enabled,
    getNextPageParam: (lastPage: { cursorNext?: string }) => lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap((page: UseInfiniteQueryResult<ManagedWordpressWebsites[]>) => page.data),
    refetchInterval: disableRefetchInterval ? false : DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });
  const fetchAllPages = useCallback(() => {
    if (!allPages) {
      setAllPages(true);
    }
  }, [allPages, setAllPages]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  useEffect(() => {
    if (allPages && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [allPages, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // reset when searchParams changes
  useEffect(() => {
    if (!shouldFetchAll) {
      setAllPages(false);
    }
  }, [searchParams, shouldFetchAll]);

  // use object assign instead of spread
  // to avoid unecessary rerenders
  return Object.assign(query, {
    fetchAllPages,
  });
};
