import * as database from '@/types/cloud/project/database';
import { getService } from '@/data/api/database/service.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetService<T extends database.Service = database.Service>(
  projectId: string,
  serviceId: string,
  options?: OptionsFor<typeof getService>,
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getService<T>({ projectId, serviceId }),
    ...options,
  });
}
