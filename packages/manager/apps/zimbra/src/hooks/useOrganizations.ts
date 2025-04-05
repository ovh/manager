import {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
  OrganizationType,
} from '@/api/organization';
import { APIV2_MAX_PAGESIZE } from '@/utils';
import { useInfiniteQueryWithFetchAllPages } from './useInfiniteQueryWithFetchAllPages';

type UseOrganizationsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationName?: string;
  shouldFetchAll?: boolean;
};

export const useOrganizations = (props: UseOrganizationsParams = {}) => {
  const { organizationName, ...options } = props;
  const { platformId } = usePlatform();

  return useInfiniteQueryWithFetchAllPages({
    ...options,
    searchParams: {
      organizationName,
    },
    queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
    queryFn: ({ pageParam, allPages, urlSearchParams }) =>
      getZimbraPlatformOrganization({
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
    initialPageParam: null,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<OrganizationType[]>) => page.data,
      ),
  });
};
