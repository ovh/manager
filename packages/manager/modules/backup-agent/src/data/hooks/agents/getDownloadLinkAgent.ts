import { useQuery } from '@tanstack/react-query';

import { downloadLinkBackupAgent } from '@/data/api/agents/agents.requests';
import { BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY } from '@/data/hooks/tenants/useVspcTenantDetails';
import { OS } from '@/types/Os.type';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';
import { useGetVspcTenantId } from '../tenants/useVspcTenantId';

export const BACKUP_VSPC_TENANT_AGENT_DOWNLOAD_LINK_QUERY_KEY = () => [
  ...BACKUP_VSPC_TENANT_DETAILS_QUERY_KEY(),
  'agent',
];

export const useBackupVSPCTenantAgentDownloadLink = ({ os, ...options }: { os?: OS | null }) => {
  const getBackupServiceId = useGetBackupServicesId();
  const getVspcTenantId = useGetVspcTenantId();

  return useQuery({
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();
      const vspcTenantId = await getVspcTenantId();

      return downloadLinkBackupAgent(backupServicesId!, vspcTenantId);
    },
    queryKey: BACKUP_VSPC_TENANT_AGENT_DOWNLOAD_LINK_QUERY_KEY(),
    enabled: !!os,
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
