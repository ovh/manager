import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformEmails,
  getZimbraPlatformEmailsQueryKey,
} from '@/api';

interface UseAccountListParams {
  domainId?: string;
  organizationId?: string;
}

export const useAccountList = ({
  domainId,
  organizationId,
}: UseAccountListParams) => {
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();

  const selectedOrganizationId =
    organizationId ?? searchParams.get('organizationId');
  const selectedDomainId = domainId ?? searchParams.get('domainId');

  const queryParameters = {
    ...(selectedOrganizationId && { organizationId: selectedOrganizationId }),
    ...(selectedDomainId && { domainId: selectedDomainId }),
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformEmailsQueryKey(platformId, queryParameters),
    queryFn: () => getZimbraPlatformEmails(platformId, queryParameters),
    enabled: !!platformId,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
