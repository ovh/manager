import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { usePlatform } from '@/hooks';

import {
  getZimbraPlatformOrganizationDetails,
  getZimbraPlatformOrganizationDetailsQueryKey,
} from '@/api';

export const useOrganization = (organizationId?: string, noCache?: boolean) => {
  const { platformId } = usePlatform();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedOrganizationId = params.get('organizationId');
  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformOrganizationDetailsQueryKey(
      platformId,
      organizationId || selectedOrganizationId,
    ),
    queryFn: () =>
      getZimbraPlatformOrganizationDetails(
        platformId,
        organizationId || selectedOrganizationId,
      ),
    enabled: !!organizationId || !!selectedOrganizationId,
    gcTime: noCache ? 0 : 5000,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
