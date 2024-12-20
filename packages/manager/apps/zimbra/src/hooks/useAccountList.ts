import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { usePlatform } from '@/hooks';
import {
  AccountType,
  getZimbraPlatformAccounts,
  getZimbraPlatformAccountsQueryKey,
} from '@/api/account';
import { APIV2_MAX_PAGESIZE } from '@/utils';

type UseAccountListParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  domainId?: string;
  organizationId?: string;
  shouldFetchAll?: boolean;
};

export const useAccountList = (props: UseAccountListParams = {}) => {
  const { domainId, organizationId, shouldFetchAll, ...options } = props;
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();

  const selectedOrganizationId =
    organizationId ?? searchParams.get('organizationId');
  const selectedDomainId = domainId ?? searchParams.get('domainId');

  const queryParameters = {
    ...(selectedOrganizationId && { organizationId: selectedOrganizationId }),
    ...(selectedDomainId && { domainId: selectedDomainId }),
  };

  const query = useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformAccountsQueryKey(
      platformId,
      queryParameters,
      shouldFetchAll,
    ),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformAccounts({
        platformId,
        queryParameters,
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
        (page: UseInfiniteQueryResult<AccountType[]>) => page.data,
      ),
  });

  useEffect(() => {
    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  return query;
};
