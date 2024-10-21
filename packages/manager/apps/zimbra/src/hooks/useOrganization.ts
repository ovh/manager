import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganizationDetails,
  getZimbraPlatformOrganizationDetailsQueryKey,
} from '@/api/organization';

export const useOrganization = (organizationId?: string, noCache?: boolean) => {
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const selectedOrganizationId = searchParams.get('organizationId');
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
