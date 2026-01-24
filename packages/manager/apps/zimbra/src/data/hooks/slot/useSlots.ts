import { useCallback, useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

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
import { useAccounts, useSlotServices } from '@/data/hooks';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

export type SlotWithService = {
  id: string;
  email?: string;
  offer: keyof typeof ZimbraOffer;
  service?: SlotService;
  organizationLabel?: string;
  accountId?: string;
  organizationId?: string;
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
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  const [slots, setSlots] = useState<SlotWithService[]>([]);
  const { data: services, isLoading: isLoadingServices } = useSlotServices({
    gcTime: 0,
    ...(options.enabled ? { enabled: options.enabled } : {}),
  });

  const { data: accounts } = useAccounts({
    organizationId,
    enabled: !!organizationId,
  });

  useEffect(() => {
    if (!query.data) {
      setSlots([]);
      return;
    }

    const accountsById = new Map((accounts ?? []).map((acc) => [acc.id, acc]));

    const filteredSlots =
      organizationId && accounts
        ? query.data.filter((item) => accountsById.has(item.currentState.accountId))
        : query.data;

    setSlots(
      filteredSlots.map((item) => {
        const account = accountsById.get(item.currentState.accountId);

        return {
          id: item.id,
          offer: item.currentState.offer,
          service: services?.[item.id],
          accountId: item.currentState.accountId,
          email: item.currentState.email,
          organizationLabel: account?.currentState.organizationLabel,
          organizationId: account?.currentState.organizationId,
        };
      }),
    );
  }, [query.data, services, accounts, organizationId]);

  // use assign and make new properties to avoid rerenders
  return Object.assign(query, {
    slots,
    isLoadingSlots: query.isLoading || isLoadingServices,
  });
};
