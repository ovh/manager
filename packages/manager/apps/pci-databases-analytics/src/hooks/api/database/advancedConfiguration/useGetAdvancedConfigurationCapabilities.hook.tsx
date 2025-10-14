import * as database from '@/types/cloud/project/database';
import { getAdvancedConfigurationCapabilities } from '@/data/api/database/advancedConfiguration.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetAdvancedConfigurationCapabilities(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getAdvancedConfigurationCapabilities>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'capabilities/advancedConfiguration',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getAdvancedConfigurationCapabilities({ projectId, engine, serviceId }),
    ...options,
  });
}
