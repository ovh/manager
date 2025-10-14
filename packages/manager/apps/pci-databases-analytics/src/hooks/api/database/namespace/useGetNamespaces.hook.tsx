import * as database from '@/types/cloud/project/database';
import { getNamespaces } from '@/data/api/database/namespace.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetNamespaces(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getNamespaces>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'namespace'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getNamespaces({ projectId, engine, serviceId }),
    ...options,
  });
}
