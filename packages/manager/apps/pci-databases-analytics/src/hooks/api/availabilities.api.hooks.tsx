import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import {
  getAvailabilities,
  getCapabilities,
  getEnginesCapabilities,
  getRegionsCapabilities,
  getSuggestions,
} from '@/data/api/databases/availabilities';
import { CdbError } from '@/data/api/databases';
import { useQueryImmediateRefetch } from './useImmediateRefetch';


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
  return useQueryImmediateRefetch({
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
  return useQueryImmediateRefetch({
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
  return useQueryImmediateRefetch({
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
  return useQueryImmediateRefetch({
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
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRegionsCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.RegionCapabilities[], Error>;
}

export interface FullCapabilities {
  /** Disks available */
  disks: string[];
  /** Database engines available */
  engines: database.EngineCapabilities[];
  /** Flavors available */
  flavors: database.capabilities.Flavor[];
  /** Options available */
  options: database.capabilities.Option[];
  /** Plans available */
  plans: database.capabilities.Plan[];
  /** Regions available */
  regions: database.RegionCapabilities[];
}
export function useGetFullCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/full-capabilities'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: async () => {
      const [
        capabilities,
        engineCapabilities,
        regionsCapabilities,
      ] = await Promise.all([
        getCapabilities(projectId),
        getEnginesCapabilities(projectId),
        getRegionsCapabilities(projectId),
      ]);

      return {
        disks: capabilities.disks,
        engines: engineCapabilities,
        flavors: capabilities.flavors,
        options: capabilities.options,
        plans: capabilities.plans,
        regions: regionsCapabilities,
      };
    },
    ...options,
  }) as UseQueryResult<FullCapabilities, CdbError>;
}
