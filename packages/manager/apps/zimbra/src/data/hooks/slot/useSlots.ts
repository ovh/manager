import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  SlotBillingStatus,
  SlotType,
  ZimbraOffer,
  getZimbraPlatformSlots,
  getZimbraPlatformSlotsQueryKey,
} from '@/data/api';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseSlotsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  accountId?: string;
  billingStatus?: keyof typeof SlotBillingStatus;
  offer?: keyof typeof ZimbraOffer;
  used?: 'true' | 'false';
  shouldFetchAll?: boolean;
};

export const useSlots = (props: UseSlotsParams = {}) => {
  const {
    shouldFetchAll,
    accountId,
    billingStatus,
    offer,
    used,
    ...options
  } = props;
  const [allPages, setAllPages] = useState(!!shouldFetchAll);
  const { platformId } = useParams();

  const urlSearchParams = buildURLSearchParams({
    accountId,
    billingStatus,
    offer,
    used,
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformSlotsQueryKey(
      platformId,
      urlSearchParams,
      allPages,
    ),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformSlots({
        platformId,
        searchParams: urlSearchParams,
        pageParam,
        ...(allPages ? { pageSize: APIV2_MAX_PAGESIZE } : {}),
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
        (page: UseInfiniteQueryResult<SlotType[]>) => page.data,
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

  useEffect(() => {
    if (!shouldFetchAll) {
      setAllPages(false);
    }
  }, [urlSearchParams]);

  return Object.assign(query, {
    fetchAllPages,
  });
};
