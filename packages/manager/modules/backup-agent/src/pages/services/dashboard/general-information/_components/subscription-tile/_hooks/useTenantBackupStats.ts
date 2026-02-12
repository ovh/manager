import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';
import { countBackupAgents } from '@/utils/countBackupAgents';

type UseTenantBackupStatsProps = {
  tenantDetails?: Resource<WithRegion<Tenant>>;
};

export function useTenantBackupStats({ tenantDetails }: UseTenantBackupStatsProps) {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD]);
  const connectedVaultCount = tenantDetails?.currentState.vaults.length ?? 0;

  const connectedVaultsText = t('number_of_linked_vaults', {
    connectedVaultCount,
  });

  const queryClient = useQueryClient();
  const { data: vspcTenantDetails, isPending } = useQuery(
    tenantsQueries.withClient(queryClient).vspcDetail(),
  );

  const installedBackupAgents = countBackupAgents(
    vspcTenantDetails?.currentState ? [vspcTenantDetails.currentState] : [],
  );

  const installedAgentsText = t('number_of_linked_server', {
    installedAgentsCount: installedBackupAgents,
  });

  return {
    connectedVaultsText,
    installedAgentsText,
    isPending,
  };
}
