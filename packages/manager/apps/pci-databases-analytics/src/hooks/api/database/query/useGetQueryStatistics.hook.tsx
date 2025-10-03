import * as database from '@/types/cloud/project/database';
import { getQueryStatistics } from '@/data/api/database/queries.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetQueryStatistics(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getQueryStatistics>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'queryStatistics',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQueryStatistics({ projectId, engine, serviceId }),
    ...options,
  });
}
