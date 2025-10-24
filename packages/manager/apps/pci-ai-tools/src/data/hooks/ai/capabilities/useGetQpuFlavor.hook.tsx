import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getQpuFlavor } from '@/data/api/ai/capabilities/capabilities.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import quantum from '@/types/Quantum';

export function useGetQpuFlavor(
  projectId: string,
  region: string,
  qpuFlavorId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'qpu',
    'capabilities',
    'region',
    region,
    qpuFlavorId,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQpuFlavor({ projectId, region, qpuFlavorId }),
    ...options,
  }) as UseQueryResult<quantum.capabilities.QPUFlavor[], Error>;
}
