import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getAvailabilities, getCapabilities } from '@/data/cdb/availabilities';

export function useGetAvailabilities(
  projectId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/availability'];
  return useQuery({
    queryKey,
    queryFn: () => getAvailabilities(projectId),
    ...options,
  }) as UseQueryResult<database.Availability[], Error>;
}


export function useGetCapabilities(
  projectId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/capabilities'];
  return useQuery({
    queryKey,
    queryFn: () => getCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.Capabilities, Error>;
}
