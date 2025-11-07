import { Links, LinkType, ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { OdsSkeleton } from "@ovhcloud/ods-components/react";
import { BACKUP_AGENT_NAMESPACES } from "@/BackupAgent.translations";
import { useBackupTenantDetails } from '@/data/hooks/tenants/useBackupTenantDetails';
import { InstalledAgents } from './_components/InstalledAgents.component';
import { ConnectedVaults } from './_components/ConnectedVaults.component';
import { useHref } from 'react-router-dom';
import { urls } from '@/routes/Routes.constants';

type SubscriptionTileProps = {
  tenantId?: string;
};

export function SubscriptionTile({ tenantId }: Readonly<SubscriptionTileProps>) {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.BILLING, BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD]);
  const { data, isLoading } = useBackupTenantDetails({ tenantId: tenantId! })
  const billingHref = useHref(urls.listingBilling)
  return (
    <ManagerTile>
      <ManagerTile.Title>{t(`${NAMESPACES.BILLING}:subscription`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:installed_agents`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : <InstalledAgents vspcTenants={data?.currentState.vspcTenants} />}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:connected_vaults`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : <ConnectedVaults tenantDetails={data} />}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <Links href={billingHref} label={t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:billing_more_info`)} type={LinkType.external} />
      </ManagerTile.Item>
    </ManagerTile>
  );
}
