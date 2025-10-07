import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {useBackupVaultDetails} from "@/data/hooks/vault/getVaultDetails";
import {OdsSkeleton} from "@ovhcloud/ods-components/react";
import {VaultStatusBadge} from "@/components/VaultStatusBadge/VaultStatusBadge.components";
import {useLocationDetails} from "@/data/hooks/location/getLocationDetails";

type GeneralInformationTileProps = {
  vaultId: string;
};

export function GeneralInformationTile({ vaultId }: GeneralInformationTileProps) {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.STATUS, NAMESPACES.REGION, 'dashboard']);
  const { data, isLoading } = useBackupVaultDetails({ vaultId })
  const { data: locationData, isLoading: isLocationLoading } = useLocationDetails(data?.currentState.azName)

  return (
      <ManagerTile>
        <ManagerTile.Title>{t(`${NAMESPACES.DASHBOARD}:general_information`)}</ManagerTile.Title>
        <ManagerTile.Divider />
          <ManagerTile.Item>
            <ManagerTile.Item.Label>{t(`${NAMESPACES.DASHBOARD}:name`)}</ManagerTile.Item.Label>
            <ManagerTile.Item.Description>
              { isLoading ? <OdsSkeleton /> : data!.currentState.name }
            </ManagerTile.Item.Description>
          </ManagerTile.Item>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>{t(`${NAMESPACES.STATUS}:status`)}</ManagerTile.Item.Label>
          <ManagerTile.Item.Description>
            { isLoading ? <OdsSkeleton /> : <VaultStatusBadge vaultStatus={data!.resourceStatus!} /> }
          </ManagerTile.Item.Description>
        </ManagerTile.Item>
        <ManagerTile.Divider />
        <ManagerTile.Item>
          <ManagerTile.Item.Label>{t(`${NAMESPACES.REGION}:localisation`)}</ManagerTile.Item.Label>
          <ManagerTile.Item.Description>
            { isLoading || isLocationLoading ? <OdsSkeleton /> : (locationData?.name ?? data!.currentState.azName)}
          </ManagerTile.Item.Description>
        </ManagerTile.Item>
      </ManagerTile>
  );
}
