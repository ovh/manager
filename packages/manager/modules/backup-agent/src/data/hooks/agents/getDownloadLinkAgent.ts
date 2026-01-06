import { useQuery } from '@tanstack/react-query';

import { downloadLinkBackupAgent } from '@/data/api/agents/agents.requests';
import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';
import { OS } from '@/types/Os.type';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_VSPC_TENANT_AGENT_DOWNLOAD_LINK_QUERY_KEY = (vspcTenantId: string) => [
  ...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(vspcTenantId),
  'agent',
];

export const useBackupVSPCTenantAgentDownloadLink = ({
  tenantId,
  os,
  ...options
}: {
  tenantId: string;
  os?: OS | null;
}) => {
  const getBackupServiceId = useGetBackupServicesId();
  return useQuery({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();

      return downloadLinkBackupAgent(backupServicesId!, tenantId);
    },
    queryKey: BACKUP_VSPC_TENANT_AGENT_DOWNLOAD_LINK_QUERY_KEY(tenantId),
    enabled: !!tenantId && !!os,
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
};
