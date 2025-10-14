import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getConnector } from '@/data/api/database/connector.api';

export function useGetConnector(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  connectorId: string,
  options?: OptionsFor<typeof getConnector>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'connector',
    connectorId,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getConnector({ projectId, engine, serviceId, connectorId }),
    ...options,
  });
}
