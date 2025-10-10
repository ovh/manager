import * as database from '@/types/cloud/project/database';
import { getService } from '@/data/api/database/service.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

type GetServiceFn<T extends database.Service> = (
  args: Parameters<typeof getService>[0],
) => Promise<T>;

export function useGetService<T extends database.Service = database.Service>(
  projectId: string,
  serviceId: string,
  options?: OptionsFor<GetServiceFn<T>>,
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getService<T>({ projectId, serviceId }),
    ...options,
  });
}
