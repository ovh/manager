import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { OdsSkeleton } from "@ovhcloud/ods-components/react";
import { useLocationDetails } from "@/data/hooks/location/getLocationDetails";
import { ResourceStatusBadge } from "@/components/ResourceStatusBadge/ResourceStatusBadge.components";
import {WithRegion} from "@/types/Utils.type";
import {Resource} from "@/types/Resource.type";

export type GeneralInformationTileProps<T extends { name: string }> = {
  resourceDetails?: Pick<Resource<T>, 'resourceStatus'> & { currentState: WithRegion<T> };
  isLoading: boolean;
};

export function GeneralInformationTile<T extends { name: string }>({ resourceDetails, isLoading }: GeneralInformationTileProps<T>) {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.STATUS, NAMESPACES.REGION, 'dashboard']);
  const { data: locationData, isLoading: isLocationLoading } = useLocationDetails(resourceDetails?.currentState.region)

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
          {isLoading ? <OdsSkeleton /> : <ResourceStatusBadge resourceStatus={resourceDetails!.resourceStatus} />}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.REGION}:localisation`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? <OdsSkeleton /> : (locationData?.location ?? resourceDetails!.currentState.region)}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.REGION}:region`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading || isLocationLoading ? <OdsSkeleton /> : (locationData?.name ?? resourceDetails!.currentState.region)}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
}
