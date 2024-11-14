import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { getFlavor } from '@/data/api/ai/capabilities.api';

export function useGetFlavor(
  projectId: string,
  region: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'ai',
    'capabilities',
    'region',
    region,
    'flavor',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getFlavor({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.capabilities.Flavor[], Error>;
}
