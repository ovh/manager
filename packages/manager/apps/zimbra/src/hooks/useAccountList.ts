import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  AccountType,
  getZimbraPlatformAccounts,
  getZimbraPlatformAccountsQueryKey,
} from '@/api/account';

type UseAccountListParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn' | 'select'
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

  return useQuery({
    ...options,
    queryKey: getZimbraPlatformAccountsQueryKey(platformId, queryParameters),
    queryFn: () => getZimbraPlatformAccounts(platformId, queryParameters),
    enabled:
      (typeof options.enabled !== 'undefined' ? options.enabled : true) &&
      !!platformId,
  }) as UseQueryResult<AccountType[]>;
};
