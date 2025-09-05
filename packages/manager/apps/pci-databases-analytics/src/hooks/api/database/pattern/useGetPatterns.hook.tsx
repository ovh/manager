import * as database from '@/types/cloud/project/database';
import { getPatterns } from '@/data/api/database/pattern.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetPatterns(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getPatterns>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'pattern'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getPatterns({ projectId, engine, serviceId }),
    ...options,
  });
}
