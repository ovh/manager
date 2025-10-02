import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { Tenant } from '@/types/Tenant.type';

import { getBackupTenants } from '../api/Backup.api';

type TUseBackupTenantsResult = UseQueryResult<Tenant[], Error>;

const getBackupTenantsQueryKey = ['backup', 'tenant'];

export const useBackupTenants = (): TUseBackupTenantsResult =>
  useQuery({
    queryKey: getBackupTenantsQueryKey,
    queryFn: () => getBackupTenants(),
    select: (res) => res.data,
  });

export const useBackupTenantsMocks = (): TUseBackupTenantsResult =>
  useQuery({
    queryKey: getBackupTenantsQueryKey,
    queryFn: () =>
      new Promise((resolve) => {
        console.log('🛜 mocking api call...');
        setTimeout(() => {
          resolve(TENANTS_MOCKS);
        }, 2000);
      }),
  });
