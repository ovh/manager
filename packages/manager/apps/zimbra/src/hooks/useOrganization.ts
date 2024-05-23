import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { usePlatform } from '@/hooks';

import {
  getZimbraPlatformOrganizationDetails,
  getZimbraPlatformOrganizationDetailsQueryKey,
} from '@/api';

export const useOrganization = () => {
  const { platformId } = usePlatform();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedOrganizationId = params.get('organizationId');
  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformOrganizationDetailsQueryKey(
      platformId,
      selectedOrganizationId,
    ),
    queryFn: () =>
      getZimbraPlatformOrganizationDetails(platformId, selectedOrganizationId),
    enabled: !!selectedOrganizationId,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
