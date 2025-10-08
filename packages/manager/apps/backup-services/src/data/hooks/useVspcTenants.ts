import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { MOCK_CONFIG } from '@/mocks/mockConfig';
import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { getVSPCTenants } from '../api/Backup.api';
import { GET_TENANTS_QUERY_KEY } from './useBackupTenants';

type TUseVSPCTenantsResult = UseQueryResult<VSPCTenant[], Error>;

const GET_VSPC_TENANTS_QUERY_KEY = [...GET_TENANTS_QUERY_KEY, 'vspc'];

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
        }, MOCK_CONFIG.defaultDelay);
      }),
  });
