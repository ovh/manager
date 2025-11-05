import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import {Tenant} from '@/types/Tenant.type';

import { getBackupTenants } from '../../api/tenants/tenants.requests';
import { Resource } from '@/types/Resource.type';
import {mapTenantResourceToTenantResourceWithRegion} from "@/utils/mappers/mapTenantToTenantWithRegion";
import {WithRegion} from "@/types/Utils.type";

export const BACKUP_TENANTS_QUERY_KEY = ['backup', 'tenants'];

export const useBackupTenants = () =>
  useQuery({
    queryKey: BACKUP_TENANTS_QUERY_KEY,
    queryFn: () => getBackupTenants(),
    select: (res) => res.data.map((tenantResource) => mapTenantResourceToTenantResourceWithRegion(tenantResource)),
  });

export const useBackupTenantsMocks = () =>
  useQuery({
    queryKey: BACKUP_TENANTS_QUERY_KEY,
    queryFn: () =>
      new Promise<{ data: Resource<Tenant>[] }>((resolve) => {
        console.log('🛜 mocking useBackupTenants api call...');
        setTimeout(() => {
          resolve({ data: TENANTS_MOCKS });
        });
      }),
    select: (res): Resource<WithRegion<Tenant>>[] => res.data.map((tenantResource) => mapTenantResourceToTenantResourceWithRegion(tenantResource)),
  });
