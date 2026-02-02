import { useHref } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ArrowLink } from '@/components/ArrowLink/ArrowLink.component';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { urls } from '@/routes/routes.constants';

import { useTenantBackupStats } from './_hooks/useTenantBackupStats';

const SubscriptionTile = () => {
  const { t } = useTranslation([
    NAMESPACES.DASHBOARD,
    NAMESPACES.BILLING,
    BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD,
    BACKUP_AGENT_NAMESPACES.COMMON,
  ]);
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(tenantsQueries.withClient(queryClient).details());
  const {
    connectedVaultsText,
    installedAgentsText,
    isPending: isStatsPending,
  } = useTenantBackupStats({
    tenantDetails: data,
  });

  const backupAgentsHref = useHref(urls.dashboardAgents);
  const vaultsHref = useHref(urls.listingVaults);

  return (
    <ManagerTile className="h-fit">
      <ManagerTile.Title>{t(`${NAMESPACES.BILLING}:subscription`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:linked_server`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending || isStatsPending ? (
            <OdsSkeleton />
          ) : (
            <div className="flex justify-between">
              <OdsText>{installedAgentsText}</OdsText>
              <ArrowLink
                href={backupAgentsHref}
                data-arialabel={t(`${BACKUP_AGENT_NAMESPACES.COMMON}:go_to_general_informations`)}
              />
            </div>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:linked_vaults`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending || isStatsPending ? (
            <OdsSkeleton />
          ) : (
            <div className="flex justify-between">
              <OdsText>{connectedVaultsText}</OdsText>
              <ArrowLink
                href={vaultsHref}
                data-arialabel={t(`${BACKUP_AGENT_NAMESPACES.COMMON}:go_to_general_informations`)}
              />
            </div>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};

export default SubscriptionTile;
