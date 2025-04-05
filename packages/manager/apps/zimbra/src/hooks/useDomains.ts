import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';

import {
  DomainType,
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api/domain';
import { APIV2_MAX_PAGESIZE } from '@/utils';
import {
  useInfiniteQueryWithFetchAllPages,
  UseInfiniteQueryWithFetchAllPagesOptions,
} from './useInfiniteQueryWithFetchAllPages';

type UseDomainsParams = Omit<
  UseInfiniteQueryWithFetchAllPagesOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationId?: string;
  domainName?: string;
};

export const useDomains = (props: UseDomainsParams = {}) => {
  const { organizationId, domainName, ...options } = props;
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();

  return useInfiniteQueryWithFetchAllPages({
    ...options,
    searchParams: {
      organizationId: organizationId ?? searchParams.get('organizationId'),
      domainName,
    },
    queryKey: getZimbraPlatformDomainsQueryKey(platformId),
    queryFn: ({ pageParam, allPages, urlSearchParams }) =>
      getZimbraPlatformDomains({
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
        (page: UseInfiniteQueryResult<DomainType[]>) => page.data,
      ),
  });
};
