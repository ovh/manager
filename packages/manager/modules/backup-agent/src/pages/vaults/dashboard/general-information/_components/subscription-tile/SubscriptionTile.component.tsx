import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {useBackupVaultDetails} from "@/data/hooks/vaults/getVaultDetails";
import {OdsSkeleton} from "@ovhcloud/ods-components/react";
import {
  BillingType,
  ConsumptionDetails,
  ConsumptionRegionsList
} from "./_components";
import {BACKUP_AGENT_NAMESPACES} from "@/BackupAgent.translations";

type SubscriptionTileProps = {
  vaultId: string;
};

export function SubscriptionTile({ vaultId }: SubscriptionTileProps) {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.BILLING, BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD]);
  const { isLoading } = useBackupVaultDetails({ vaultId })

  return (
    <ManagerTile>
      <ManagerTile.Title>{t(`${NAMESPACES.BILLING}:subscription`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.DASHBOARD}:consumption`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          { isLoading ? <OdsSkeleton /> : <><ConsumptionRegionsList /><ConsumptionDetails /></> }
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:type_billing`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          { isLoading ? <OdsSkeleton /> : <BillingType /> }
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
