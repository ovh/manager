import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getCapabilities } from '@/data/api/database/capabilities.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.Capabilities, Error>;
}
