import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganizationDetails,
  getZimbraPlatformOrganizationDetailsQueryKey,
} from '@/api/organization';

export const useOrganization = (organizationId?: string, noCache?: boolean) => {
  const { platformId } = usePlatform();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedOrganizationId = params.get('organizationId');
  return useQuery({
    queryKey: getZimbraPlatformOrganizationDetailsQueryKey(
      platformId,
      organizationId || selectedOrganizationId,
    ),
    queryFn: () =>
      getZimbraPlatformOrganizationDetails(
        platformId,
        organizationId || selectedOrganizationId,
      ),
    enabled: (!!organizationId || !!selectedOrganizationId) && !!platformId,
    gcTime: noCache ? 0 : 5000,
  });
};
