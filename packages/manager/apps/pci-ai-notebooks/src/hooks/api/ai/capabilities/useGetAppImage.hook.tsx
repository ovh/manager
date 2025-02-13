import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { getAppImages } from '@/data/api/ai/capabilities.api';

export function useGetAppImages(
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
    'app',
    'image',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getAppImages({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.capabilities.app.Image[], Error>;
}
