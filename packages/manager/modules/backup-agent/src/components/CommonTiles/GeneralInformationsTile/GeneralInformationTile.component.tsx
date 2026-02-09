import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';

import { ResourceStatusBadge } from '@/components/ResourceStatusBadge/ResourceStatusBadge.component';
import { locationsQueries } from '@/data/queries/locations.queries';
import { Resource } from '@/types/Resource.type';
import { WithRegion } from '@/types/Utils.type';

export type GeneralInformationTileProps<T extends { name: string }> = {
  resourceDetails?: Pick<Resource<T>, 'resourceStatus'> & { currentState: WithRegion<T> };
  isLoading: boolean;
  children?: React.ReactNode;
};

export function GeneralInformationTile<T extends { name: string }>({
  resourceDetails,
  isLoading,
  children,
}: GeneralInformationTileProps<T>) {
  const { t } = useTranslation([
    NAMESPACES.DASHBOARD,
    NAMESPACES.STATUS,
    NAMESPACES.REGION,
    'dashboard',
  ]);
  const region = resourceDetails?.currentState.region;
  const { data: locationData, isPending: isLocationLoading } = useQuery({
    ...locationsQueries.detail(region!),
    enabled: !!region,
  });

  return (
    <ManagerTile className="h-fit">
      <ManagerTile.Title>{t(`${NAMESPACES.DASHBOARD}:general_information`)}</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.DASHBOARD}:name`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? <OdsSkeleton /> : <OdsText>{resourceDetails!.currentState.name}</OdsText>}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>{t(`${NAMESPACES.STATUS}:status`)}</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          {isLoading ? (
            <OdsSkeleton />
          ) : (
            <ResourceStatusBadge resourceStatus={resourceDetails!.resourceStatus} />
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
            <OdsText>{locationData?.location ?? resourceDetails!.currentState.region}</OdsText>
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
            <OdsText>{locationData?.name ?? resourceDetails!.currentState.region}</OdsText>
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      {children}
    </ManagerTile>
  );
}

export default GeneralInformationTile;
