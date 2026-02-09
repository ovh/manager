import { QueryClient, queryOptions } from '@tanstack/react-query';

import {
  downloadLinkBackupAgent,
  getBackupAgents,
  getBackupAgentsDetails,
} from '@/data/api/agents/agents.requests';

import { queryKeys } from './queryKeys';
import { servicesQueries } from './services.queries';
import { tenantsQueries } from './tenants.queries';

// ─── Standalone functions (all need QueryClient for dependency resolution) ───

const list = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.agents.all(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await tenantsQueries.withClient(queryClient).vspcTenantId();
      return getBackupAgents(backupServicesId!, vspcTenantId);
    },
  });

const detail = (queryClient: QueryClient) => (agentId: string) =>
  queryOptions({
    queryKey: queryKeys.agents.detail(agentId),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await tenantsQueries.withClient(queryClient).vspcTenantId();
      return getBackupAgentsDetails({
        backupServicesId: backupServicesId!,
        vspcTenantId,
        backupAgentId: agentId,
      });
    },
    enabled: !!agentId,
  });

const downloadLink = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.agents.downloadLink(),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await tenantsQueries.withClient(queryClient).vspcTenantId();
      return downloadLinkBackupAgent(backupServicesId!, vspcTenantId);
    },
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => ({
  list: list(queryClient),
  detail: detail(queryClient),
  downloadLink: downloadLink(queryClient),
});

export const agentsQueries = { withClient };
