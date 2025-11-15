import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { getVSPCTenants } from '../../api/tenants/tenants.requests';
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';
import {Resource} from "@/types/Resource.type";

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
