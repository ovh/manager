import { QueryObserverOptions } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getService } from '@/data/api/database/service.api';
import { CdbError } from '@/data/api/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetService<T extends database.Service = database.Service>(
  projectId: string,
  serviceId: string,
  options: Omit<QueryObserverOptions<T, CdbError>, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getService<T>({ projectId, serviceId }),
    ...options,
  });
}
