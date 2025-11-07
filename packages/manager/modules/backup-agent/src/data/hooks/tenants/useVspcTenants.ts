import { DefinedInitialDataOptions, UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';

import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { getVSPCTenantDetails, getVSPCTenants } from '../../api/tenants/tenants.requests';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';
import { useMemo } from 'react';
import { AssociatedTenantVSPC } from '@/types/Tenant.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

type TUseVSPCTenantsResult = UseQueryResult<Resource<VSPCTenant>[], Error>;

export const GET_VSPC_TENANTS_QUERY_KEY = [...BACKUP_TENANTS_QUERY_KEY, 'vspc'];

export const useVSPCTenants = (): TUseVSPCTenantsResult =>
  useQuery({
    queryKey: GET_VSPC_TENANTS_QUERY_KEY,
    queryFn: () => getVSPCTenants(),
    select: (res) => res.data,
  });

export const useVSPCTenantsMocks = (): TUseVSPCTenantsResult =>
  useQuery({
    queryKey: GET_VSPC_TENANTS_QUERY_KEY,
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking useVSPCTenants api call...');
        setTimeout(() => {
          resolve(VSPC_TENANTS_MOCKS);
        });
      }),
  });

export const useInstalledBackupAgents = ({
  vspcTenants,
}: {
  vspcTenants: AssociatedTenantVSPC[];
} & Partial<Omit<DefinedInitialDataOptions<Resource<VSPCTenant>, unknown>, "queryKey" | "queryFn">>) => {
  const vspcTenantIds = useMemo(() => {
    if (!vspcTenants) return [];
    return vspcTenants.map((vspc) => vspc.id);
  }, [vspcTenants]);
  const vspcTenantQueries = useQueries({
    queries: vspcTenantIds.map((vspcTenantId) => ({
      queryKey: ['vspcTenantDetails', vspcTenantId],
      queryFn: () => getVSPCTenantDetails(vspcTenantId),
      enabled: !!vspcTenantId,
    })),
    combine: (results) => {
      const tenants = results
      .map((r) => r.data)
      .filter((tenant): tenant is VSPCTenant => !!tenant);
      
      return {
        installedBackupAgents: countBackupAgents(tenants),
        isLoading: results.some((q) => q.isLoading),
      }
    },
  });
  return vspcTenantQueries;
};