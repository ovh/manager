import { Query, useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganizationDetails,
  getZimbraPlatformOrganizationDetailsQueryKey,
  OrganizationType,
} from '@/api/organization';
import {
  useQueriesWithPolling,
  useQueryWithPolling,
} from './useQueryWithPolling';

export type UseOrganizationWithPollingParams = {
  organizationId: string;
  isComplete: (data: OrganizationType) => boolean;
  onComplete: (data: OrganizationType) => void;
};

export type UseOrganizationsWithPollingParams = {
  organizationIds: string[];
  isComplete: (data: OrganizationType) => boolean;
  onComplete: (data: OrganizationType) => void;
};

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

export const useOrganizationWithPolling = ({
  organizationId,
  isComplete,
  onComplete,
}: UseOrganizationWithPollingParams) => {
  const { platformId } = usePlatform();
  return useQueryWithPolling<OrganizationType>({
    queryKey: getZimbraPlatformOrganizationDetailsQueryKey(
      platformId,
      organizationId,
    ),
    queryFn: () =>
      getZimbraPlatformOrganizationDetails(platformId, organizationId),
    enabled: !!organizationId && !!platformId,
    isComplete,
    onComplete,
    maxRefreshes: 5,
    throttleInterval: 3000,
  });
};

export const useOrganizationsWithPolling = (
  params: UseOrganizationsWithPollingParams,
) => {
  const { platformId } = usePlatform();
  const { organizationIds, isComplete, onComplete } = params;

  return useQueriesWithPolling<OrganizationType>({
    options: organizationIds.map((organizationId) => {
      return {
        queryKey: getZimbraPlatformOrganizationDetailsQueryKey(
          platformId,
          organizationId,
        ),
        queryFn: () =>
          getZimbraPlatformOrganizationDetails(platformId, organizationId),
        enabled: !!organizationId && !!platformId,
      };
    }),
    isComplete,
    onComplete,
    maxRefreshes: 5,
    throttleInterval: 3000,
  });
};
