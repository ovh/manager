import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  OrganizationType,
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
} from '@/data/api';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseOrganizationsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationName?: string;
  shouldFetchAll?: boolean;
};

export const useOrganizations = (props: UseOrganizationsParams = {}) => {
  const { shouldFetchAll, organizationName, ...options } = props;
  const { platformId } = useParams();
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
  const searchParams = buildURLSearchParams({
    organizationName,
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformOrganizationQueryKey(platformId, searchParams, allPages),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformOrganization({
        platformId,
        searchParams,
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
      data?.pages.flatMap((page: UseInfiniteQueryResult<OrganizationType[]>) => page.data),
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
  }, [searchParams]);

  // use object assign instead of spread
  // to avoid unecessary rerenders
  return Object.assign(query, {
    fetchAllPages,
  });
};
