import { useQuery } from '@tanstack/react-query';

import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
import { mockAgentDownloadLinks } from '@/mocks/agents/agentDownloadLinks';
import { AgentDownloadLinks } from '@/types/AgentDownloadLinks';
import { OS } from '@/types/Os.type';

export const BACKUP_VSPC_TENANT_AGENT_DOWNLOAD_LINK_QUERY_KEY = (vspcTenantId: string) => [
  ...BACKUP_TENANT_DETAILS_QUERY_KEY(vspcTenantId),
  'agent',
];

export const useBackupVSPCTenantAgentDownloadLink = ({
  tenantId,
  os,
  ...options
}: {
  tenantId?: string;
  os?: OS;
}) =>
  useQuery({
    queryFn: () =>
      new Promise<AgentDownloadLinks>((resolve) => {
        setTimeout(() => {
          resolve(mockAgentDownloadLinks);
        }, 1000);
      }),
    queryKey: BACKUP_VSPC_TENANT_AGENT_DOWNLOAD_LINK_QUERY_KEY(tenantId!),
    enabled: !!tenantId,
    select: (data) => {
      switch (os) {
        case 'LINUX':
          return data.linuxUrl;
        case 'WINDOWS':
          return data.windowsUrl;
        case 'MAC':
          return data.macUrl;
        default:
          return data.linuxUrl;
      }
    },
    ...options,
  });
