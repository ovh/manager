import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

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

type WebsitesResponse = {
  data: ManagedWordpressWebsites[];
  cursorNext?: string;
};

type UseManagedWordpressWebsitesParams = Omit<
  UseInfiniteQueryOptions<WebsitesResponse, Error, ManagedWordpressWebsites[], WebsitesResponse>,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  defaultFQDN?: string;
  shouldFetchAll?: boolean;
};

export const useManagedWordpressWebsites = (props: UseManagedWordpressWebsitesParams = {}) => {
  const { defaultFQDN, shouldFetchAll, ...options } = props;
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
  const { serviceName } = useParams();
  const searchParams = buildURLSearchParams({
    defaultFQDN,
  });
  const query = useInfiniteQuery<WebsitesResponse, Error, ManagedWordpressWebsites[]>({
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
    enabled:
      typeof props.enabled === 'function'
        ? props.enabled
        : typeof props.enabled !== 'boolean' || props.enabled,
    getNextPageParam: (lastPage) => lastPage.cursorNext,
    select: (data) => data?.pages.flatMap((page: WebsitesResponse) => page.data) ?? [],
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });
  const fetchAllPages = useCallback(() => {
    if (!allPages) {
      setAllPages(true);
    }
  }, [allPages]);
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
