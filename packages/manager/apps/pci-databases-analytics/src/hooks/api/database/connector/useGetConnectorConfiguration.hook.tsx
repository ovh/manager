import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getConnectorConfiguration } from '@/data/api/database/connector.api';

export function useGetConnectorConfiguration(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  connectorCapabilityId: string,
  options?: OptionsFor<typeof getConnectorConfiguration>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'capabilities',
    'connector',
    connectorCapabilityId,
    'configuration',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getConnectorConfiguration({
        projectId,
        engine,
        serviceId,
        connectorCapabilityId,
      }),
    ...options,
  });
}
