import * as database from '@/types/cloud/project/database';
import { getCurrentQueries } from '@/data/api/database/queries.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetCurrentQueries(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getCurrentQueries>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'currentQueries'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getCurrentQueries({ projectId, engine, serviceId }),
    ...options,
  });
}
