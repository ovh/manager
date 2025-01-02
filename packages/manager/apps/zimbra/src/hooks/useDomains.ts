import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { usePlatform, useOrganization } from '@/hooks';

import {
  DomainType,
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api/domain';
import { APIV2_MAX_PAGESIZE } from '@/utils';

type UseDomainsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationId?: string;
  shouldFetchAll?: boolean;
};

export const useDomains = (props: UseDomainsParams = {}) => {
  const { organizationId, shouldFetchAll, ...options } = props;
  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();
  const selectedOrganizationId = organization?.id;

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformDomainsQueryKey(
      platformId,
      organizationId || selectedOrganizationId,
      shouldFetchAll,
    ),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformDomains({
        platformId,
        organizationId: organizationId || selectedOrganizationId,
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
        (page: UseInfiniteQueryResult<DomainType[]>) => page.data,
      ),
  });

  useEffect(() => {
    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  return query;
};
