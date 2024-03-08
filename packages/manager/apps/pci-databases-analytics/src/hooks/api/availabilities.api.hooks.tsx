import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  getAvailabilities,
  getCapabilities,
  getEnginesCapabilities,
  getRegionsCapabilities,
  getSuggestions,
} from '@/api/databases/availabilities';

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

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/availability/suggestions'];
  return useQuery({
    queryKey,
    queryFn: () => getSuggestions(projectId),
    ...options,
  }) as UseQueryResult<database.Suggestion[], Error>;
}

export function useGetCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities'];
  return useQuery({
    queryKey,
    queryFn: () => getCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.Capabilities, Error>;
}

export function useGetEnginesCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities/engines'];
  return useQuery({
    queryKey,
    queryFn: () => getEnginesCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.EngineCapabilities[], Error>;
}

export function useGetRegionsCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities/regions'];
  return useQuery({
    queryKey,
    queryFn: () => getRegionsCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.RegionCapabilities[], Error>;
}
