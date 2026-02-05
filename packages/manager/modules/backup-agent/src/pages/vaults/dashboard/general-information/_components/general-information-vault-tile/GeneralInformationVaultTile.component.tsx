import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { ResourceStatusBadge } from '@/components/ResourceStatusBadge/ResourceStatusBadge.component';
import { useLocationDetails } from '@/data/hooks/location/getLocationDetails';
import { useBackupVaultDetails } from '@/data/hooks/vaults/getVaultDetails';

type GeneralInformationVaultTileProps = {
  vaultId: string;
};

export function GeneralInformationVaultTile({ vaultId }: GeneralInformationVaultTileProps) {
  const { t } = useTranslation([
    NAMESPACES.DASHBOARD,
    NAMESPACES.STATUS,
    NAMESPACES.REGION,
    'dashboard',
  ]);
  const { data: vault, isLoading: isLoadingVault } = useBackupVaultDetails({ vaultId });
  const { data: locationData, isLoading: isLoadingLocation } = useLocationDetails(
    vault?.currentState.region,
  );

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
          {isLoadingVault ? <OdsSkeleton /> : <OdsText>{vault!.currentState.name}</OdsText>}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.STATUS}:status`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoadingVault ? (
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
          {isLoadingVault || isLoadingLocation ? (
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
          {isLoadingVault || isLoadingLocation ? (
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
          {isLoadingVault ? <OdsSkeleton /> : <OdsText>{vault!.currentState.resourceName}</OdsText>}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
