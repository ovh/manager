import { useCallback, useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  MailingListType,
  getZimbraPlatformMailingLists,
  getZimbraPlatformMailingListsQueryKey,
} from '@/data/api';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseMailingListsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationId?: string;
  shouldFetchAll?: boolean;
};

export const useMailingLists = (props: UseMailingListsParams = {}) => {
  const { organizationId, shouldFetchAll, ...options } = props;
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
  const { platformId } = useParams();
  const [searchParams] = useSearchParams();

  const urlSearchParams = buildURLSearchParams({
    organizationId: organizationId ?? searchParams.get('organizationId'),
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformMailingListsQueryKey(platformId, urlSearchParams, allPages),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformMailingLists({
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
      data?.pages.flatMap((page: UseInfiniteQueryResult<MailingListType[]>) => page.data),
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
