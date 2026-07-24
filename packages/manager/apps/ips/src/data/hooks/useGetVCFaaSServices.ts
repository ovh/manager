import { useQuery } from '@tanstack/react-query';

import { IpTypeEnum } from '@/data/constants';

import {
  getVmwareCloudDirectorOrganizations,
  getVmwareCloudDirectorOrganizationsQueryKey,
  getVmwareCloudDirectorVirtualDataCenters,
} from '../api';
import { ServiceInfoWithId } from './useGetProductServices';

/**
 * Fetch the list of VCFaaS (VMware Cloud Director) services eligible for an
 * additional IP order.
 *
 * Business rule: only keep organizations whose first virtualDataCenter has a
 * `commercialRange` equal to `NSX`. The organization `id` is used as the
 * service identifier, while `targetSpec.fullName` is used as the displayed
 * label (falling back to `id` when absent).
 *
 * The returned services are sorted alphabetically by `serviceName`.
 */
export const useGetVCFaaSServices = () => {
  const { data, isLoading, isError, error } = useQuery<ServiceInfoWithId[]>({
    queryKey: getVmwareCloudDirectorOrganizationsQueryKey,
    queryFn: async () => {
      const { data: organizations } =
        await getVmwareCloudDirectorOrganizations();
      const withVdc = await Promise.all(
        organizations.map(async (org) => {
          const { data: vdcs } = await getVmwareCloudDirectorVirtualDataCenters(
            org.id,
          );
          return { org, firstVdc: vdcs?.[0] };
        }),
      );
      return withVdc
        .filter(
          ({ firstVdc }) => firstVdc?.currentState?.commercialRange === 'NSX',
        )
        .map(({ org }) => ({
          id: org.id,
          category: IpTypeEnum.PCC,
          serviceName: org.id,
          displayName: org.targetSpec?.fullName || org.id,
          region: org.currentState?.region,
          resourceStatus: org.resourceStatus,
        }))
        .sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    },
  });

  return {
    services: data ?? [],
    isLoading,
    isError,
    error,
  };
};
