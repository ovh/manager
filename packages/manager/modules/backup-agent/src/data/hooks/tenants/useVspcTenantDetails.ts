import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { Resource } from '@/types/Resource.type';
import { WithRegion } from '@/types/Utils.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { mapTenantResourceToTenantResourceWithRegion } from '@/utils/mappers/mapTenantToTenantWithRegion';

import { GET_VSPC_TENANTS_QUERY_KEY } from './useVspcTenants';

export const BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY = (vspcTenantID: string) => [
  ...GET_VSPC_TENANTS_QUERY_KEY,
  vspcTenantID,
];

export const useBackupVSPCTenantDetails = ({
  tenantId,
  ...options
}: {
  tenantId: string;
} & Partial<
  Omit<
    DefinedInitialDataOptions<Resource<VSPCTenant>, unknown, Resource<WithRegion<VSPCTenant>>>,
    'queryKey' | 'queryFn'
  >
>) =>
  useQuery({
    queryFn: () =>
      new Promise<Resource<VSPCTenant>>((resolve, reject) => {
        const result = VSPC_TENANTS_MOCKS.find((tenant) => tenant.id === tenantId);
        result ? resolve(result) : reject(new Error('Tenant not found'));
      }),
    queryKey: BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(tenantId),
    select: (data): Resource<WithRegion<VSPCTenant>> =>
      mapTenantResourceToTenantResourceWithRegion(data),
    ...options,
  });
