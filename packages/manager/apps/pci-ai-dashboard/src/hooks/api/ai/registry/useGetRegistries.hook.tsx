import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { getRegistries } from '@/data/api/ai/registry.api';

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
