import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  AccountType,
  getZimbraPlatformAccounts,
  getZimbraPlatformAccountsQueryKey,
} from '@/api/account';

type UseAccountListParams = Omit<
  UseInfiniteQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'getNextPageParam' | 'initialPageParam'
> & {
  domainId?: string;
  organizationId?: string;
};

export const useAccountList = (props: UseAccountListParams = {}) => {
  const { domainId, organizationId, ...options } = props;
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();

  const selectedOrganizationId =
    organizationId ?? searchParams.get('organizationId');
  const selectedDomainId = domainId ?? searchParams.get('domainId');

  const queryParameters = {
    ...(selectedOrganizationId && { organizationId: selectedOrganizationId }),
    ...(selectedDomainId && { domainId: selectedDomainId }),
  };

  return useInfiniteQuery({
    ...options,
    initialPageParam: null,
    queryKey: getZimbraPlatformAccountsQueryKey(platformId, queryParameters),
    queryFn: ({ pageParam }) =>
      getZimbraPlatformAccounts({
        platformId,
        queryParameters,
        pageParam,
      }),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId,
    getNextPageParam: (lastPage: { cursorNext?: string }) =>
      lastPage.cursorNext,
    select: (data) =>
      data?.pages.flatMap(
        (page: UseInfiniteQueryResult<AccountType[]>) => page.data,
      ),
  });
};
