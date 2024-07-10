import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { ai } from '@/types/ai';
import { getRegistries } from '@/data/api/apiRegistry';

export function useGetRegistries(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'registry'];
  return useQuery({
    queryKey,
    queryFn: () => getRegistries({ projectId }),
    ...options,
  }) as UseQueryResult<ai.registry.Registry[], Error>;
}
