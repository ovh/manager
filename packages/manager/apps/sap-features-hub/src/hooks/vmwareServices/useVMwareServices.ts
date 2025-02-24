import { useQueries, useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  GetClustersIdsProps,
  getDatacentreCluster,
  getDatacentreClusterIds,
  getVMwareDatacentres,
  getVMwareServices,
} from '@/data/api/vmwareServices';
import { VMwareDatacentreCluster } from '@/types/vmwareService.type';

export const useVMwareServices = () =>
  useQuery({
    queryKey: ['vmwareServices'],
    queryFn: getVMwareServices,
    select: (res) => res.data,
  });

export const useVMwareDatacentres = (serviceName: string) =>
  useQuery({
    queryKey: ['vmwareServices', serviceName, 'datacentres'],
    queryFn: () => getVMwareDatacentres(serviceName),
    select: (res) => res.data.results,
    enabled: !!serviceName,
  });

export const useDatacentreClusters = ({
  serviceName,
  datacenterId,
}: GetClustersIdsProps) => {
  const {
    data: clusterIds = [],
    isLoading: isLoadingIds,
    isError: isErrorIds,
    error: idsError,
  } = useQuery({
    queryKey: [
      'vmwareServices',
      serviceName,
      'datacentres',
      datacenterId,
      'clusters',
    ],
    queryFn: () => getDatacentreClusterIds({ serviceName, datacenterId }),
    select: (res) => res.data,
    enabled: !!serviceName && !!datacenterId,
  });

  const queries = useQueries({
    queries: clusterIds.map((clusterId) => ({
      queryKey: [
        'vmwareServices',
        serviceName,
        'datacentres',
        datacenterId,
        'clusters',
        clusterId,
      ],
      queryFn: () =>
        getDatacentreCluster({ serviceName, datacenterId, clusterId }),
      select: (res: ApiResponse<VMwareDatacentreCluster>) => res.data,
      enabled: !!clusterId && !isLoadingIds && !isErrorIds,
    })),
  });

  const isLoadingClusters = queries.some((query) => query.isLoading);
  const isErrorClusters = queries.some((query) => query.isError);
  const clusters = queries.map((query) => query.data);
  const clustersError = queries.find((query) => query.isError)?.error;

  return {
    data: clusters,
    isLoading: isLoadingIds || isLoadingClusters,
    isError: isErrorIds || isErrorClusters,
    error: idsError || clustersError,
  };
};

// TODO : implement fetching with iceberg
// export const useDatacentreClusters = async ({
//   serviceName,
//   datacenterId,
// }: GetClusterProps) => {
//   if (serviceName && datacenterId) {
//     try {
//       const res = await fetchIcebergV6({
//         route: `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster`,
//       }).then(({ data, status, totalCount }) => ({ data, status, totalCount }));
//       return res;
//     } catch (error) {
//       return null;
//     }
//   }
//   return null;
// };
