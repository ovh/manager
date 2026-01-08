import { useTranslation } from 'react-i18next';

import { OdsIcon, OdsSkeleton, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupVaultDetails } from '@/data/hooks/vaults/getVaultDetails';

import { BillingType, ConsumptionDetails, ConsumptionRegionsList } from './_components';

type SubscriptionTileProps = {
  vaultId: string;
};

export const CONSUMPTION_MAX_VALUE_IN_TB = 100;

export function SubscriptionTile({ vaultId }: SubscriptionTileProps) {
  const { t } = useTranslation([
    NAMESPACES.DASHBOARD,
    NAMESPACES.BILLING,
    BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD,
  ]);
  const { isPending, data: vault } = useBackupVaultDetails({ vaultId });
  const tooltipId = 'consumption-tooltip';

  return (
    <ManagerTile className="h-fit">
      <ManagerTile.Title>{t(`${NAMESPACES.BILLING}:subscription`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          <div className="flex items-center gap-x-4">
            {t(`${NAMESPACES.DASHBOARD}:consumption`)}
            <OdsIcon name="circle-info" id={tooltipId} className="hover:cursor-help" />
            <OdsTooltip triggerId={tooltipId}>
              <OdsText>
                {t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:consumption_tooltip`)}
              </OdsText>
            </OdsTooltip>
          </div>
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending ? (
            <OdsSkeleton />
          ) : (
            <section className="flex flex-col gap-4">
              <ConsumptionDetails />
              <ConsumptionRegionsList
                primaryRegion={vault?.currentState.region ?? 'N/A'}
                secondaryRegion={vault?.currentState.secondaryRegion}
              />
            </section>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:type_billing`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isPending ? <OdsSkeleton /> : <BillingType />}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
