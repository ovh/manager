import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { ai } from '@/types/ai';
import { getRegions } from '@/data/api/ai/capabilities.api';

export function useGetRegions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'capabilities', 'region'];
  return useQuery({
    queryKey,
    queryFn: () => getRegions({ projectId }),
    ...options,
  }) as UseQueryResult<ai.capabilities.Region[], Error>;
}
