import { useQuery } from '@tanstack/react-query';
import { getNutanixServerQueryKey, getNutanixServer } from '@/data/api/nutanix';

export const useGetNutanixServer = () => {
  const { data: NutanixServerResponse, isLoading, isError, error } = useQuery({
    queryKey: getNutanixServerQueryKey,
    queryFn: () => getNutanixServer(),
    select: (data) => {
      const nutanixServers: { [key: string]: string } = {};
      for (const cluster of data) {
        for (const node of cluster.targetSpec.nodes) {
          nutanixServers[node.server] = cluster.targetSpec.name;
        }
      }
      return nutanixServers;
    },
  });
  return { nutanixServers: NutanixServerResponse, isLoading, isError, error };
};
