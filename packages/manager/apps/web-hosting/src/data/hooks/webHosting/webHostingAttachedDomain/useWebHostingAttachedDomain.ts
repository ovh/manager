import { useCallback, useEffect, useState } from 'react';

import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  deleteAttachedDomains,
  getWebHostingAttachedDomain,
  getWebHostingAttachedDomainQueryKey,
} from '@/data/api/webHosting';
import { WebsiteType } from '@/data/types/product/website';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseWebsitesListParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  domain?: string;
  shouldFetchAll?: boolean;
};

export const useWebHostingAttachedDomain = (props: UseWebsitesListParams = {}) => {
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
    getNextPageParam: (lastPage: { cursorNext?: string }) => lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap((page: UseInfiniteQueryResult<WebsiteType[]>) => page.data),
  });

  const fetchAllPages = useCallback(() => {
    if (!allPages) {
      setAllPages(true);
    }
  }, [allPages, setAllPages]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  useEffect(() => {
    if (allPages && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [allPages, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // reset when searchParams changes
  useEffect(() => {
    if (!shouldFetchAll) {
      setAllPages(false);
    }
  }, [searchParams, shouldFetchAll]);

  // use object assign instead of spread
  // to avoid unecessary rerenders
  return Object.assign(query, {
    fetchAllPages,
  });
};

export const useDeleteAttachedDomains = (
  serviceName: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: ({
      domains,
      bypassDNSConfiguration,
    }: {
      domains: string[];
      bypassDNSConfiguration: boolean;
    }) => deleteAttachedDomains(serviceName, domains, bypassDNSConfiguration),
    onSuccess,
    onError,
  });

  return {
    deleteAttachedDomains: mutation.mutate,
    ...mutation,
  };
};
