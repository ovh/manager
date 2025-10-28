import * as database from '@/types/cloud/project/database';
import { getServiceCapabilitiesIntegrations } from '@/data/api/database/integration.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetCapabilitiesIntegrations(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getServiceCapabilitiesIntegrations>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'capabilities/integration',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getServiceCapabilitiesIntegrations({ projectId, engine, serviceId }),
    ...options,
  });
}
