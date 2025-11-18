import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useInstalledBackupAgents } from '@/data/hooks/tenants/useVspcTenants';
import { Resource } from '@/types/Resource.type';
import { AssociatedTenantVSPC, Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';

type UseTenantBackupStatsProps = {
  tenantDetails?: Resource<WithRegion<Tenant>>;
  vspcTenants?: AssociatedTenantVSPC[];
};

export function useTenantBackupStats({
  tenantDetails,
  vspcTenants = [],
}: UseTenantBackupStatsProps) {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD]);

  const connectedVaultCount = tenantDetails?.currentState.vaults.length ?? 0;

  const connectedVaultsText = t('number_of_connected_vaults', {
    connectedVaultCount,
  });

  const { installedBackupAgents } = useInstalledBackupAgents({ vspcTenants });

  const installedAgentsText = t('number_of_installed_agents', {
    installedAgentsCount: installedBackupAgents,
  });

  return {
    connectedVaultsText,
    installedAgentsText,
  };
}
