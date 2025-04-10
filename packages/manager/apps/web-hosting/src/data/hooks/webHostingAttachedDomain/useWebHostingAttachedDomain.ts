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

type UseWebsitesListParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  shouldFetchAll?: boolean;
};

export const useWebHostingAttachedDomain = (
  props: UseWebsitesListParams = {},
) => {
  const { shouldFetchAll, ...options } = props;
  const [allPages, setAllPages] = useState(!!shouldFetchAll);

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getWebHostingAttachedDomainQueryKey(allPages),
    queryFn: ({ pageParam }) =>
      getWebHostingAttachedDomain({
        pageParam: pageParam as string,
        ...(allPages ? { pageSize: 500 } : {}),
      }),
    enabled: (q) =>
      typeof options.enabled === 'function'
        ? options.enabled(q)
        : typeof options.enabled !== 'boolean' || options.enabled,
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
  }, [query.data]);
  useEffect(() => {
    if (!shouldFetchAll) {
      setAllPages(false);
    }
  }, []);

  return Object.assign(query, {
    fetchAllPages,
  });
};
