import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

export const getServices = async (projectId: string): Promise<number[]> => {
  const { data } = await v6.get<number[]>(`services?resourceName=${projectId}`);
  return data;
};

export const useServices = ({ projectId }: { projectId: string }) => {
  return useQuery({
    queryKey: ['services', projectId],
    queryFn: () => getServices(projectId),
  });
};
