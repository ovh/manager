import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getServices } from '@/data/api/database/service.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetServices(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/service'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServices({ projectId }),
    ...options,
  }) as UseQueryResult<database.Service[], Error>;
}
