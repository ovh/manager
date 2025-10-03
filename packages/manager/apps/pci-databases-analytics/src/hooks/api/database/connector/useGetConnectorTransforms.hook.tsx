import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getConnectorTransforms } from '@/data/api/database/connector.api';

export function useGetConnectorTransforms(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  connectorCapabilityId: string,
  options?: OptionsFor<typeof getConnectorTransforms>,
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
      getConnectorTransforms({
        projectId,
        engine,
        serviceId,
        connectorCapabilityId,
      }),
    ...options,
  });
}
