import { useQuery, DefinedInitialDataOptions } from "@tanstack/react-query";
import { BACKUP_TENANTS_QUERY_KEY } from './useBackupTenants';
import { Tenant } from '@/types/Tenant.type';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import {Resource, ResourceWithAzName} from "@/types/Resource.type";
import {
  mapTenantResourceToTenantResourceWithAzName,
} from "@/utils/mappers/mapTenantToTenantWithAzName";

export const BACKUP_TENANT_DETAILS_QUERY_KEY = (tenantId: string) => [...BACKUP_TENANTS_QUERY_KEY, tenantId];

export const useBackupTenantDetails = (
  {
    tenantId,
    ...options
  }: {
    tenantId: string;
  } & Partial<Omit<DefinedInitialDataOptions<Resource<Tenant>, unknown, Resource<Tenant> & ResourceWithAzName>, "queryKey" | "queryFn">>,
) => useQuery({
  queryFn: () => new Promise<Resource<Tenant>>((resolve, reject) => {
    const result = TENANTS_MOCKS.find(tenant => tenant.id === tenantId)
    result ? resolve(result) : reject(new Error('Tenant not found'))
  }),
  queryKey: BACKUP_TENANT_DETAILS_QUERY_KEY(tenantId),
  select: (data):  Resource<Tenant> & ResourceWithAzName => mapTenantResourceToTenantResourceWithAzName(data),
  ...options
})
