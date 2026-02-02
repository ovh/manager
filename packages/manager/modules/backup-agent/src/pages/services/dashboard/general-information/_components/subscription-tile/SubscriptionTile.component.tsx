import { useTranslation } from 'react-i18next';

import { useHref } from 'react-router-dom';

import { OdsSkeleton, OdsText, OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupTenantDetails } from '@/data/hooks/tenants/useBackupTenantDetails';
import { urlParams, urls } from '@/routes/routes.constants';

import { useTenantBackupStats } from './_hooks/useTenantBackupStats';

type SubscriptionTileProps = {
  tenantId?: string;
};

const SubscriptionTile = ({ tenantId }: SubscriptionTileProps) => {
  const { t } = useTranslation([
    NAMESPACES.DASHBOARD,
    NAMESPACES.BILLING,
    BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD,
    BACKUP_AGENT_NAMESPACES.COMMON,
  ]);
  const { data, isPending } = useBackupTenantDetails();
  const {
    connectedVaultsText,
    installedAgentsText,
    isPending: isStatsPending,
  } = useTenantBackupStats({
    tenantDetails: data,
    vspcTenantIds: [tenantId ?? ''].filter(Boolean),
  });

  const backupAgentsHref = useHref(urls.dashboardTenantAgents.replace(urlParams.tenantId, tenantId ?? ''));
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
          {isPending || isStatsPending ? <OdsSkeleton /> : 
          <div className='flex justify-between'>
            <OdsText>{installedAgentsText}</OdsText>
            <OdsLink
              className="[&::part(link)]:hover:!bg-none [&::part(link)]:!transition-none"
              icon={ODS_ICON_NAME.arrowRight}
              href={backupAgentsHref}
              data-arialabel={t(`${BACKUP_AGENT_NAMESPACES.COMMON}:go_to_general_informations`)}
            />
          </div>}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:linked_vaults`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending || isStatsPending ? <OdsSkeleton /> : 
          <div className='flex justify-between'>
            <OdsText>{connectedVaultsText}</OdsText>
            <OdsLink
              className="[&::part(link)]:hover:!bg-none [&::part(link)]:!transition-none"
              icon={ODS_ICON_NAME.arrowRight}
              href={vaultsHref}
              data-arialabel={t(`${BACKUP_AGENT_NAMESPACES.COMMON}:go_to_general_informations`)}
            />
          </div>}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};

export default SubscriptionTile;
