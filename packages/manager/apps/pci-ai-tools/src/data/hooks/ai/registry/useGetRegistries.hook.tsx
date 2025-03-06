import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { getRegistries } from '@/data/api/ai/registry/registry.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetRegistries(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'registry'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRegistries({ projectId }),
    ...options,
  }) as UseQueryResult<ai.registry.Registry[], Error>;
}
