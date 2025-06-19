import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDedicatedCloudDatacenterList,
  getDedicatedCloudDatacenterListQueryKey,
  getDedicatedCloudServiceDatacenter,
  getDedicatedCloudServiceDatacenterQueryKey,
} from '../api/hpc-vmware-vsphere-datacenter';

export function useVmwareVsphereDatacenter(serviceName?: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['combined-datacenter', serviceName],
    queryFn: async () => {
      const idsResponse = await queryClient.fetchQuery({
        queryKey: [...getDedicatedCloudDatacenterListQueryKey, serviceName],
        queryFn: () => getDedicatedCloudDatacenterList(serviceName),
      });

      const datacenterId = idsResponse.data?.[0];

      if (!datacenterId) throw new Error('No datacenter ID found');

      const detailResponse = await queryClient.fetchQuery({
        queryKey: getDedicatedCloudServiceDatacenterQueryKey(
          serviceName,
          datacenterId,
        ),
        queryFn: () =>
          getDedicatedCloudServiceDatacenter(serviceName, datacenterId),
      });

      return detailResponse.data;
    },
    enabled: !!serviceName,
  });
}
