import { QueryClient, queryOptions } from '@tanstack/react-query';

import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
} from '@ovh-ux/manager-module-common-api';

import { getBackupServices } from '@/data/api/backup/backupServices.requests';
import { getVSPCTenants } from '@/data/api/tenants/tenants.requests';
import { UnresolvableBackupAgentServiceError } from '@/data/errors/UnresolvableBackupAgentServiceError';
import { hasBackupAgentAddon } from '@/utils/hasBackupAgentAddon/hasBackupAgentAddon';

import { queryKeys } from './queryKeys';

const ONE_DAY_HOURS_IN_MS = 1000 * 60 * 60 * 24;

// ─── Base queries (no QueryClient needed) ───

const all = () =>
  queryOptions({
    queryKey: queryKeys.backupServices.all,
    queryFn: () => getBackupServices(),
    staleTime: ONE_DAY_HOURS_IN_MS,
  });

const agoraServiceId = (resourceName: string) =>
  queryOptions({
    queryKey: getResourceServiceIdQueryKey({ resourceName }),
    queryFn: () => getResourceServiceId({ resourceName }),
  });

const vspcTenantsOf = (backupServicesId: string) =>
  queryOptions({
    queryKey: queryKeys.backupServices.vspc(backupServicesId),
    queryFn: () => getVSPCTenants({ backupServicesId }),
    staleTime: ONE_DAY_HOURS_IN_MS,
  });

// ─── Queries needing QueryClient ───

const resolveBackupServicesId = async (queryClient: QueryClient): Promise<string> => {
  const services = await queryClient.ensureQueryData(all());

  const owners = await Promise.all(
    services.map(async ({ id }) => {
      const vspcTenants = await queryClient.ensureQueryData(vspcTenantsOf(id)).catch(() => []);
      return vspcTenants.some(hasBackupAgentAddon) ? id : undefined;
    }),
  );

  const backupServicesId = owners.find(Boolean);
  if (!backupServicesId) throw new UnresolvableBackupAgentServiceError();

  return backupServicesId;
};

const withClient = (queryClient: QueryClient) => ({
  backupServicesId: () => resolveBackupServicesId(queryClient),
});

// ─── Factory ───

export const servicesQueries = { all, agoraServiceId, withClient };
