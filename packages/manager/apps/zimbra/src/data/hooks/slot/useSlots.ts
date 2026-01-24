import { useCallback, useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  ResourceStatus,
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
  status?: keyof typeof ResourceStatus;
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
  email?: string;
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
  const { email, ...slotOptions } = options;
  const query = useSlots(slotOptions);
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');

  const { data: accounts } = useAccounts({
    email,
    organizationId: organizationId ?? undefined,
    enabled: !!email || !!organizationId,
  });

  const { data: services, isLoading: isLoadingServices } = useSlotServices({
    gcTime: 0,
  });

  const [slots, setSlots] = useState<SlotWithService[]>([]);

  useEffect(() => {
    if (!query.data) {
      setSlots([]);
      return;
    }

    const accountsById = new Map((accounts ?? []).map((acc) => [acc.id, acc]));

    const mappedSlots: SlotWithService[] = query.data
      .filter((slot) => {
        const account = accountsById.get(slot.currentState.accountId);
        if (
          (organizationId && account?.currentState.organizationId !== organizationId) ||
          (email && !account)
        )
          return false;
        return true;
      })
      .map((slot) => {
        const account = accountsById.get(slot.currentState.accountId);
        return {
          id: slot.id,
          offer: slot.currentState.offer,
          service: services?.[slot.id],
          accountId: slot.currentState.accountId,
          email: slot.currentState.email,
          organizationLabel: account?.currentState.organizationLabel,
          organizationId: account?.currentState.organizationId,
          status: account?.resourceStatus,
        };
      });

    setSlots(mappedSlots);
  }, [query.data, accounts, services, organizationId, email]);

  return Object.assign(query, {
    slots,
    isLoadingSlots: query.isLoading || isLoadingServices,
  });
};
