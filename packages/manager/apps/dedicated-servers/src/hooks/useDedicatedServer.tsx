import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getdedicatedServers } from '@/data/api/dedicated-servers';

export const useDedicatedServer = () => {
  return useQuery<string[], ApiError>({
    queryKey: ['get/dedicated-server'],
    queryFn: async () => {
      const { data } = await getdedicatedServers();
      return data;
    },
  });
};
