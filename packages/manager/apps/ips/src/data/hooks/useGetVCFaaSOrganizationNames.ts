import { useQuery } from '@tanstack/react-query';

import {
  getVmwareCloudDirectorOrganizations,
  getVmwareCloudDirectorOrganizationsQueryKey,
} from '../api';

/**
 * Fetch the VCFaaS (VMware Cloud Director) organizations and index their
 * display name (`targetSpec.fullName`) by organization id.
 *
 * Unlike {@link useGetVCFaaSServices}, no `virtualDataCenter` call is made: the
 * eligible services are already known here, only their label is missing.
 */
export const useGetVCFaaSOrganizationNames = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const { data, isLoading, isError, error } = useQuery<Record<string, string>>({
    // dedicated key: `useGetVCFaaSServices` caches another shape under the raw one
    queryKey: [...getVmwareCloudDirectorOrganizationsQueryKey, 'displayName'],
    queryFn: async () => {
      const { data: organizations } =
        await getVmwareCloudDirectorOrganizations();
      return Object.fromEntries(
        organizations
          .filter(({ id, targetSpec }) => !!id && !!targetSpec?.fullName)
          .map(({ id, targetSpec }) => [id, targetSpec.fullName]),
      );
    },
    enabled,
  });

  return {
    displayNameById: data ?? {},
    isLoading,
    isError,
    error,
  };
};
