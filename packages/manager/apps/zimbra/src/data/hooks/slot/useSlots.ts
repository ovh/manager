import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  SlotBillingStatus,
  SlotService,
  SlotType,
  ZimbraOffer,
  getZimbraPlatformSlots,
  getZimbraPlatformSlotsQueryKey,
} from '@/data/api';
import { useSlotServices } from '@/data/hooks';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

export type SlotWithService = {
  id: string;
  email?: string;
  offer: keyof typeof ZimbraOffer;
  service?: SlotService;
};

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
  const { shouldFetchAll, accountId, billingStatus, offer, used, ...options } = props;
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
    queryKey: getZimbraPlatformSlotsQueryKey(platformId, urlSearchParams, allPages),
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
        : typeof options.enabled !== 'boolean' || options.enabled) && !!platformId,
    getNextPageParam: (lastPage: { cursorNext?: string }) => lastPage.cursorNext,
    select: (data) => data?.pages.flatMap((page: UseInfiniteQueryResult<SlotType[]>) => page.data),
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

export const useSlotsWithService = (options: UseSlotsParams = {}) => {
  const query = useSlots(options);
  const { data: services, isLoading: isLoadingServices } = useSlotServices({
    gcTime: 0,
    ...(options.enabled ? { enabled: options.enabled } : {}),
  });

  const [slots, setSlots] = useState<SlotWithService[]>([]);

  useEffect(() => {
    setSlots(
      query.data?.map((item) => ({
        id: item.id,
        offer: item.currentState.offer,
        service: services?.[item.id],
      })) ?? [],
    );
  }, [query.data, services]);

  // use assign and make new properties to avoid rerenders
  return Object.assign(query, {
    slots,
    isLoadingSlots: query.isLoading || isLoadingServices,
  });
};
