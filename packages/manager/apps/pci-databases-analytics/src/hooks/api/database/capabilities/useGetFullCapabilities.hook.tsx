import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import {
  getCapabilities,
  getEnginesCapabilities,
  getRegionsCapabilities,
} from '@/data/api/database/capabilities.api';
import { CdbError } from '@/data/api/database';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export interface FullCapabilities {
  /** Disks available */
  disks: string[];
  /** Database engines available */
  engines: database.capabilities.EngineCapabilities[];
  /** Flavors available */
  flavors: database.capabilities.Flavor[];
  /** Options available */
  options: database.capabilities.Option[];
  /** Plans available */
  plans: database.capabilities.Plan[];
  /** Regions available */
  regions: database.capabilities.RegionCapabilities[];
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
