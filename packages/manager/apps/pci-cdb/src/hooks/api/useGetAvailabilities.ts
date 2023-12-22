import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { cdbApi } from '@/data/cdbapi';
import { database } from '@/models/database';

export function useGetAvailabilities(
  projectId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/availability'];
  return useQuery({
    queryKey,
    queryFn: () => cdbApi.getAvailabilities(projectId),
    ...options,
  }) as UseQueryResult<database.Availability[], Error>;
}
