import { useQuery } from '@tanstack/react-query';

import { downloadLinkBackupAgent } from '@/data/api/agents/agents.requests';
import { BACKUP_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useBackupTenantDetails';
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
    queryFn: () => downloadLinkBackupAgent(tenantId!),
    queryKey: BACKUP_VSPC_TENANT_AGENT_DOWNLOAD_LINK_QUERY_KEY(tenantId!),
    enabled: !!tenantId,
    select: (data) => {
      switch (os) {
        case 'WINDOWS':
          return data.windowsUrl;
        case 'LINUX':
        default:
          return data.linuxUrl;
      }
    },
    ...options,
  });
