import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getNutanixServerQueryKey,
  getNutanixServer,
  NutanixCluster,
} from '@/data/api/nutanix';

export const useGetNutanixServer = () => {
  const { data: NutanixServerResponse, isLoading, isError, error } = useQuery<
    ApiResponse<NutanixCluster[]>,
    ApiError,
    { [key: string]: string }
  >({
    queryKey: getNutanixServerQueryKey,
    queryFn: () => getNutanixServer(),
    select: ({ data }) => {
      console.log(data);
      const nutanixServers: { [key: string]: string } = {};
      for (let cluster of data) {
        for (let node of cluster.targetSpec.nodes) {
          nutanixServers[node.server] = cluster.targetSpec.name;
        }
      }
      return nutanixServers;
    },
  });

  return { nutanixServers: NutanixServerResponse, isLoading, isError, error };
};
