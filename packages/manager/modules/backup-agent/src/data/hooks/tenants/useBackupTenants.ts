import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { Tenant } from '@/types/Tenant.type';

import { getBackupTenants } from '../../api/tenants/tenants.requests';

type TUseBackupTenantsResult = UseQueryResult<Tenant[], Error>;

export const GET_TENANTS_QUERY_KEY = ['backup', 'tenants'];

export const useBackupTenants = (): TUseBackupTenantsResult =>
  useQuery({
    queryKey: GET_TENANTS_QUERY_KEY,
    queryFn: () => getBackupTenants(),
    select: (res) => res.data,
  });

export const useBackupTenantsMocks = (): TUseBackupTenantsResult =>
  useQuery({
    queryKey: GET_TENANTS_QUERY_KEY,
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking useBackupTenants api call...');
        setTimeout(() => {
          resolve(TENANTS_MOCKS);
        });
      }),
  });
