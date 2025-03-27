import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
  OrganizationType,
} from '@/api/organization';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseOrganizationsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationName?: string;
  shouldFetchAll?: boolean;
};

export const useOrganizations = (props: UseOrganizationsParams = {}) => {
  const { shouldFetchAll, organizationName, ...options } = props;
  const { platformId } = usePlatform();
  const searchParams = buildURLSearchParams({
    organizationName,
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformOrganizationQueryKey(
      platformId,
      searchParams,
      shouldFetchAll,
    ),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformOrganization({
        platformId,
        searchParams,
        pageParam,
        ...(shouldFetchAll ? { pageSize: APIV2_MAX_PAGESIZE } : {}),
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
        (page: UseInfiniteQueryResult<OrganizationType[]>) => page.data,
      ),
  });

  useEffect(() => {
    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  return query;
};
