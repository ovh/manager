import * as database from '@/types/cloud/project/database';
import { getServiceIntegrations } from '@/data/api/database/integration.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetIntegrations(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getServiceIntegrations>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'integration'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceIntegrations({ projectId, engine, serviceId }),
    ...options,
  });
}
