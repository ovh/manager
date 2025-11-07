import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LinkType, Links, ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupTenantDetails } from '@/data/hooks/tenants/useBackupTenantDetails';
import { urls } from '@/routes/Routes.constants';

import { useTenantBackupStats } from './_hooks/useTenantBackupStats';

type SubscriptionTileProps = {
  tenantId?: string;
};

const SubscriptionTile = ({ tenantId }: SubscriptionTileProps) => {
  const { t } = useTranslation([
    NAMESPACES.DASHBOARD,
    NAMESPACES.BILLING,
    BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD,
  ]);
  const { data, isLoading } = useBackupTenantDetails({ tenantId: tenantId! });
  const billingHref = useHref(urls.listingBilling);
  const { connectedVaultsText, installedAgentsText } = useTenantBackupStats({
    tenantDetails: data,
    vspcTenants: data?.currentState.vspcTenants,
  });

  return (
    <ManagerTile>
      <ManagerTile.Title>{t(`${NAMESPACES.BILLING}:subscription`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:installed_agents`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : installedAgentsText}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:connected_vaults`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : connectedVaultsText}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <Links
          href={billingHref}
          label={t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:billing_more_info`)}
          type={LinkType.external}
        />
      </ManagerTile.Item>
    </ManagerTile>
  );
};

export default SubscriptionTile;
