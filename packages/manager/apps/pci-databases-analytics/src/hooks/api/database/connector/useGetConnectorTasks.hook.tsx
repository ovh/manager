import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getConnectorTasks } from '@/data/api/database/connector.api';

export function useGetConnectorTasks(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  connectorId: string,
  options?: OptionsFor<typeof getConnectorTasks>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'connector',
    connectorId,
    'task',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getConnectorTasks({ projectId, engine, serviceId, connectorId }),
    ...options,
  });
}
