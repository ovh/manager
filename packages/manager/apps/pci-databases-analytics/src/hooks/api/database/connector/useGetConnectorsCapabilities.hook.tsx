import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getConnectorsCapabilities } from '@/data/api/database/connector.api';

export function useGetConnectorsCapabilities(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getConnectorsCapabilities>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'capabilities',
    'connector',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getConnectorsCapabilities({ projectId, engine, serviceId }),
    ...options,
  });
}
