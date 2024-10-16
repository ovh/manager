import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
  OrganizationType,
} from '@/api/organization';

export const useOrganizationList = (
  options: Omit<
    UseInfiniteQueryOptions,
    'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
  > = {},
) => {
  const { platformId } = usePlatform();

  return useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformOrganization({ platformId, pageParam }),
    enabled:
      (typeof options.enabled !== 'undefined' ? options.enabled : true) &&
      !!platformId,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<OrganizationType[]>) => page.data,
      ),
  });
};
