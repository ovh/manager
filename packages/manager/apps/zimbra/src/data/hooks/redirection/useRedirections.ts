import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  RedirectionType,
  getZimbraPlatformRedirections,
  getZimbraPlatformRedirectionsQueryKey,
} from '@/data/api';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseRedirectionsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  destination?: string;
  source?: string;
  organizationId?: string;
  shouldFetchAll?: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const useRedirections = (props: UseRedirectionsParams = {}) => {
  const { destination, source, organizationId, shouldFetchAll, ...options } = props;
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
  const { platformId } = useParams();

  const urlSearchParams = buildURLSearchParams({
    destination,
    source,
    organizationId,
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformRedirectionsQueryKey(platformId, urlSearchParams, allPages),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformRedirections({
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
      data?.pages.flatMap((page: UseInfiniteQueryResult<RedirectionType[]>) => page.data),
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
