import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getService } from '@/data/api/database/service.api';
import { CdbError } from '@/data/api/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetService(
  projectId: string,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getService({ projectId, serviceId }),
    options,
  }) as UseQueryResult<database.Service, CdbError>;
}
