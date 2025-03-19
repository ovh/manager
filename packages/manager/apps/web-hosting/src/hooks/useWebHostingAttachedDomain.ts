import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getWebHostingAttachedDomain,
  getWebHostingAttachedDomainQueryKey,
} from '@/api';
import { WebsiteType } from '@/api/type';

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
  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getWebHostingAttachedDomainQueryKey(shouldFetchAll),
    queryFn: ({ pageParam }) =>
      getWebHostingAttachedDomain({
        pageParam: pageParam as string,
        ...(shouldFetchAll ? { pageSize: 9999 } : {}),
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
  useEffect(() => {
    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);
  return query;
};
