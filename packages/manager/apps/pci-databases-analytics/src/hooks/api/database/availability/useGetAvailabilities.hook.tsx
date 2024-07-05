import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getAvailabilities } from '@/data/api/database/availability.api';

export function useGetAvailabilities(
  projectId: string,
  serviceId?: string,
  action?: database.availability.ActionEnum,
  target?: database.availability.TargetEnum,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'database/availability',
    serviceId,
    action,
    target,
  ].filter(Boolean);
  return useQuery({
    queryKey,
    queryFn: () =>
      getAvailabilities({
        projectId,
        ...(serviceId ? { serviceId } : {}),
        ...(action ? { action } : {}),
        ...(target ? { target } : {}),
      }),
    ...options,
  }) as UseQueryResult<database.Availability[], Error>;
}
