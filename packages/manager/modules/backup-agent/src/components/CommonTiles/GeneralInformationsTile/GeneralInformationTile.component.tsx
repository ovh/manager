import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { ResourceWithName, ResourceWithAzName, ResourceWithStatus } from '@/types/Resource.type';
import { OdsSkeleton } from "@ovhcloud/ods-components/react";
import { useLocationDetails } from "@/data/hooks/location/getLocationDetails";
import { ResourceStatusBadge } from "@/components/ResourceStatusBadge/ResourceStatusBadge.components";

export type GeneralInformationTileProps = {
  resourceDetails?: ResourceWithName & ResourceWithAzName & ResourceWithStatus;
  isLoading: boolean;
};

export function GeneralInformationTile({ resourceDetails, isLoading }: GeneralInformationTileProps) {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.STATUS, NAMESPACES.REGION, 'dashboard']);
  const { data: locationData, isLoading: isLocationLoading } = useLocationDetails(resourceDetails?.currentState.azName)

  return (
    <ManagerTile>
      <ManagerTile.Title>{t(`${NAMESPACES.DASHBOARD}:general_information`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.DASHBOARD}:name`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : resourceDetails!.currentState.name}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.STATUS}:status`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : <ResourceStatusBadge vaultStatus={resourceDetails!.resourceStatus!} />}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.REGION}:localisation`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? <OdsSkeleton /> : (locationData?.location ?? resourceDetails!.currentState.azName)}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.REGION}:region`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? <OdsSkeleton /> : (locationData?.name ?? resourceDetails!.currentState.azName)}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
