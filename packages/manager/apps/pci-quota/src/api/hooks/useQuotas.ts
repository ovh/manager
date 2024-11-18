import { useQuery } from '@tanstack/react-query';
import { getQuotas } from '@/api/data/quota';

export const useQuotas = (projectId: string) => {
  const query = useQuery({
    queryKey: ['project', projectId, 'quotas'],
    queryFn: () => getQuotas(projectId),
  });
  return {
    ...query,
    quotas: query.data,
  };
};
