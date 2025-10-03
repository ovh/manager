import * as database from '@/types/cloud/project/database';
import { getAdvancedConfiguration } from '@/data/api/database/advancedConfiguration.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetAdvancedConfiguration(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getAdvancedConfiguration>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'advancedConfiguration',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getAdvancedConfiguration({ projectId, engine, serviceId }),
    ...options,
  });
}
