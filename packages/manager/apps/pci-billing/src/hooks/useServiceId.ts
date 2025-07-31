import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

const getServices = async (projectId: string): Promise<number[]> => {
  const { data } = await v6.get<number[]>(`services?resourceName=${projectId}`);
  return data;
};

export const useServiceId = (projectId: string) =>
  useQuery({
    queryKey: ['services', projectId],
    queryFn: async () => {
      const services = await getServices(projectId);
      return services?.[0] || null;
    },
    enabled: !!projectId,
  });
