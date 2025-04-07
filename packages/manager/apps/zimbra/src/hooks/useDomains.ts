import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  DomainType,
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api/domain';
import { APIV2_MAX_PAGESIZE, buildURLSearchParams } from '@/utils';

type UseDomainsParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  organizationId?: string;
  domainName?: string;
  shouldFetchAll?: boolean;
};

export const useDomains = (props: UseDomainsParams = {}) => {
  const { organizationId, domainName, shouldFetchAll, ...options } = props;
  const { platformId } = useParams();
  const [searchParams] = useSearchParams();
  const urlSearchParams = buildURLSearchParams({
    organizationId: organizationId ?? searchParams.get('organizationId'),
    domainName,
  });

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformDomainsQueryKey(
      platformId,
      urlSearchParams,
      shouldFetchAll,
    ),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformDomains({
        platformId,
        searchParams: urlSearchParams,
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
