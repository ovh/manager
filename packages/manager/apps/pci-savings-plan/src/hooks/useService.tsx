import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

const getServices = async (projectId: string): Promise<number[]> => {
  const { data } = await v6.get<number[]>(`services?resourceName=${projectId}`);
  return data;
};

export const useServices = ({ projectId }: { projectId: string }) =>
  useQuery({
    queryKey: ['services', projectId],
    queryFn: () => getServices(projectId),
  });
