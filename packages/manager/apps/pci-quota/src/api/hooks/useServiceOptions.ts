import { useQuery } from '@tanstack/react-query';
import { getServiceOptions } from '@/api/data/service-option';

export const useGetServiceOptions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'serviceOptions'],
    queryFn: () => getServiceOptions(projectId),
  });
