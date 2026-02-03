import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useInstalledBackupAgents } from '@/data/hooks/tenants/useVspcTenants';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';

type UseTenantBackupStatsProps = {
  tenantDetails?: Resource<WithRegion<Tenant>>;
};

export function useTenantBackupStats({ tenantDetails }: UseTenantBackupStatsProps) {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD]);
  const connectedVaultCount = tenantDetails?.currentState.vaults.length ?? 0;

  const connectedVaultsText = t('number_of_linked_vaults', {
    connectedVaultCount,
  });

  const { installedBackupAgents, isPending } = useInstalledBackupAgents();

  const installedAgentsText = t('number_of_linked_server', {
    installedAgentsCount: installedBackupAgents,
  });

  return {
    connectedVaultsText,
    installedAgentsText,
    isPending,
  };
}
