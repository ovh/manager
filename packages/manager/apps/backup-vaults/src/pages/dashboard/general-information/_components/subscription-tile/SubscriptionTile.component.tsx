import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {useBackupVaultDetails} from "@/data/hooks/vault/getVaultDetails";
import {OdsSkeleton} from "@ovhcloud/ods-components/react";
import {
  ConsumptionDetails,
  ConsumptionRegionsList
} from "./_components";
import {
  BillingType
} from "@/pages/dashboard/general-information/_components/subscription-tile/_components/BillingType.component";

type SubscriptionTileProps = {
  vaultId: string;
};

export function SubscriptionTile({ vaultId }: SubscriptionTileProps) {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.BILLING, 'dashboard']);
  const { isLoading } = useBackupVaultDetails({ vaultId })

  return (
    <ManagerTile>
      <ManagerTile.Title>{t(`${NAMESPACES.BILLING}:subscription`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.DASHBOARD}:consumption`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description className="flex flex-col gap-5">
          { isLoading ? <OdsSkeleton /> : <><ConsumptionRegionsList /><ConsumptionDetails /></> }
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t('dashboard:type_billing')}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description className="flex flex-col gap-2">
          { isLoading ? <OdsSkeleton /> : <BillingType /> }
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
