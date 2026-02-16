import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getBackupPolicies } from '@/data/api/tenants/backupPolicies.requests';
import {
  getTenantDetails,
  getVSPCTenantDetails,
  getVSPCTenants,
} from '@/data/api/tenants/tenants.requests';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';
import { mapTenantResourceToTenantResourceWithRegion } from '@/utils/mappers/mapTenantToTenantWithRegion';

import { queryKeys } from './queryKeys';
import { servicesQueries } from './services.queries';

// ─── Standalone functions (all need QueryClient for dependency resolution) ───

const details = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.tenants.detail(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      return getTenantDetails(backupServicesId!);
    },
    select: (data): Resource<WithRegion<Tenant>> =>
      mapTenantResourceToTenantResourceWithRegion(data),
  });

const vspcAll = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.tenants.vspc.all(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      return getVSPCTenants({ backupServicesId: backupServicesId! });
    },
  });

const vspcDetail = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.tenants.vspc.detail(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const tenants = await queryClient.ensureQueryData(vspcAll(queryClient)());
      const vspcTenantId = tenants[0]!.id;
      return getVSPCTenantDetails(backupServicesId!, vspcTenantId);
    },
  });

const vspcPolicies = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.tenants.vspc.policies(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const tenants = await queryClient.ensureQueryData(vspcAll(queryClient)());
      const vspcTenantId = tenants[0]!.id;
      return getBackupPolicies(backupServicesId!, vspcTenantId);
    },
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => ({
  details: details(queryClient),
  vspcAll: vspcAll(queryClient),
  vspcDetail: vspcDetail(queryClient),
  vspcPolicies: vspcPolicies(queryClient),
  /** Resolves the first vspcTenantId from cache (ensureQueryData). */
  vspcTenantId: async () => {
    const tenants = await queryClient.ensureQueryData(vspcAll(queryClient)());
    if (!tenants?.length) throw new Error('No VSPC Tenant found');
    return tenants[0]!.id;
  },
});

export const tenantsQueries = { withClient };
