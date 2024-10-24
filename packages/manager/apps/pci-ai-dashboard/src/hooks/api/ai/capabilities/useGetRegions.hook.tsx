import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { getRegions } from '@/data/api/ai/capabilities.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch.hook';

export function useGetRegions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'capabilities', 'region'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRegions({ projectId }),
    ...options,
  }) as UseQueryResult<ai.capabilities.Region[], Error>;
}
