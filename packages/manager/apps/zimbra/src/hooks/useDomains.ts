import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { usePlatform, useOrganization } from '@/hooks';

import {
  DomainType,
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api/domain';

type UseDomainsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationId?: string;
};

export const useDomains = (props: UseDomainsParams = {}) => {
  const { organizationId, ...options } = props;
  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();
  const selectedOrganizationId = organization?.id;

  return useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformDomainsQueryKey(
      platformId,
      organizationId || selectedOrganizationId,
    ),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformDomains({
        platformId,
        organizationId: organizationId || selectedOrganizationId,
        pageParam,
      }),
    enabled:
      (typeof options.enabled !== 'undefined' ? options.enabled : true) &&
      !!platformId,
    staleTime: Infinity,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<DomainType[]>) => page.data,
      ),
  });
};
