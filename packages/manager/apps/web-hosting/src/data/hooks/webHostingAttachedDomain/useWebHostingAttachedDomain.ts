import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import {
  getWebHostingAttachedDomain,
  getWebHostingAttachedDomainQueryKey,
} from '@/data/api/AttachedDomain';
import { WebsiteType } from '@/data/type';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseWebsitesListParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  domain?: string;
  shouldFetchAll?: boolean;
};

export const useWebHostingAttachedDomain = (
  props: UseWebsitesListParams = {},
) => {
  const { domain, shouldFetchAll, ...options } = props;
  const searchParams = buildURLSearchParams({
    domain,
  });
  const [allPages, setAllPages] = useState(!!shouldFetchAll);

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,

    queryKey: getWebHostingAttachedDomainQueryKey(searchParams, allPages),
    queryFn: ({ pageParam }) =>
      getWebHostingAttachedDomain({
        pageParam: pageParam as string,
        searchParams,
        ...(allPages ? { pageSize: APIV2_MAX_PAGESIZE } : {}),
      }),
    enabled: (q) =>
      typeof props.enabled === 'function'
        ? props.enabled(q)
        : typeof props.enabled !== 'boolean' || props.enabled,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<WebsiteType[]>) => page.data,
      ),
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
