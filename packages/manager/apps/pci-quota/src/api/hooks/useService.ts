import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/api/data/service';

export const useServices = () =>
  useQuery({
    queryKey: ['services'],
    queryFn: () => getServices(),
  });

export const useProjectService = (projectId: string) => {
  const query = useServices();

  return {
    ...query,
    services: query.data,
    data: query.data?.find((s) => s?.resource?.name === projectId),
  };
};
