import { useTranslation } from 'react-i18next';

import { OdsBadge, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceStatusBadge } from '@/components/ResourceStatusBadge/ResourceStatusBadge.component';
import { useLocationDetails } from '@/data/hooks/location/getLocationDetails';
import { useBackupVaultDetails } from '@/data/hooks/vaults/getVaultDetails';
import { VAULT_DEFAULT_IMMUTABILITY } from '@/module.constants';

type GeneralInformationVaultTileProps = {
  vaultId: string;
};

export function GeneralInformationVaultTile({ vaultId }: GeneralInformationVaultTileProps) {
  const { t } = useTranslation([
    NAMESPACES.DASHBOARD,
    NAMESPACES.STATUS,
    NAMESPACES.REGION,
    'dashboard',
    BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD,
  ]);
  const { data: vault, isLoading: isLoadingVault } = useBackupVaultDetails({ vaultId });
  const { data: locationData, isLoading: isLocationLoading } = useLocationDetails(
    vault?.currentState.region,
  );

  const isLoading = isLoadingVault;

  /*
  The code below is a copy of GeneralInformationTile component, made specifically for vaults.
  It may be better to make the tile more generic and use it here but it requires more changes.
  TODO: Refactor this to use a more generic approach
  TODO: Refactor this to avoid using the non-null assertion operator everywhere
  */

  return (
    <ManagerTile className="h-fit">
      <ManagerTile.Title>{t(`${NAMESPACES.DASHBOARD}:general_information`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.DASHBOARD}:name`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : <OdsText>{vault!.currentState.name}</OdsText>}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.STATUS}:status`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? (
            <OdsSkeleton />
          ) : (
            <ResourceStatusBadge resourceStatus={vault!.resourceStatus} />
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.REGION}:localisation`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? (
            <OdsSkeleton />
          ) : (
            <OdsText>{locationData?.location ?? vault!.currentState.region}</OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.REGION}:region`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? (
            <OdsSkeleton />
          ) : (
            <OdsText>{locationData?.name ?? vault!.currentState.region}</OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.DASHBOARD}:reference`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? (
            <OdsSkeleton />
          ) : (
            <OdsText>{vault!.currentState.resourceName}</OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:immutability`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? (
            <OdsSkeleton />
          ) : (
            <OdsBadge
              color="success"
              label={t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:immutability_duration_enabled`, {
                duration: VAULT_DEFAULT_IMMUTABILITY.duration,
              })}
            />
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:encryption`)}
        </ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? (
            <OdsSkeleton />
          ) : (
            <OdsBadge
              color="success"
              label={t(`${BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD}:encryption_enabled`, {
                encryption: VAULT_DEFAULT_IMMUTABILITY.encryption,
              })}
            />
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
