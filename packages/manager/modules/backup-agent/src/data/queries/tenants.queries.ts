import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getBackupPolicies } from '@/data/api/tenants/backupPolicies.requests';
import {
  getTenantDetails,
  getVSPCTenantDetails,
  getVSPCTenants,
} from '@/data/api/tenants/tenants.requests';
import { selectBackupAgentVspcTenants } from '@/data/selectors/tenants.selectors';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';
import { hasBackupAgentAddon } from '@/utils/hasBackupAgentAddon/hasBackupAgentAddon';
import { mapTenantResourceToTenantResourceWithRegion } from '@/utils/mappers/mapTenantToTenantWithRegion';

import { queryKeys } from './queryKeys';
import { servicesQueries } from './services.queries';

const resolveVspcTenantId = async (queryClient: QueryClient): Promise<string> => {
  const tenants = await queryClient.ensureQueryData(vspcAll(queryClient)());
  const id = tenants?.find(hasBackupAgentAddon)?.id;
  if (!id) throw new Error('No Backup Agent VSPC Tenant found');
  return id;
};

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
    select: selectBackupAgentVspcTenants,
  });

const vspcDetail = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.tenants.vspc.detail(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await resolveVspcTenantId(queryClient);
      return getVSPCTenantDetails(backupServicesId!, vspcTenantId);
    },
  });

const vspcPolicies = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.tenants.vspc.policies(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await resolveVspcTenantId(queryClient);
      return getBackupPolicies(backupServicesId!, vspcTenantId);
    },
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => ({
  details: details(queryClient),
  vspcAll: vspcAll(queryClient),
  vspcDetail: vspcDetail(queryClient),
  vspcPolicies: vspcPolicies(queryClient),
  vspcTenantId: () => resolveVspcTenantId(queryClient),
});

export const tenantsQueries = { withClient };
