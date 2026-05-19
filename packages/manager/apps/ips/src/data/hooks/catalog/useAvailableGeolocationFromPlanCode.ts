import React from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { CatalogIpConfiguration, CatalogIpPlan } from '@/data/api';
import { ServiceType } from '@/types';

import { useCatalogIps } from './useCatalogIps';
import { useDedicatedCloudGeolocations } from './useDedicatedCloudGeolocations';
import { useDedicatedServerGeolocations } from './useDedicatedServerGeolocations';
import { useVpsGeolocations } from './useVpsGeolocations';

export const useAvailableGeolocationFromPlanCode = ({
  planCode,
  serviceName,
  serviceType,
  ipQuantity,
}: {
  planCode?: string;
  serviceName?: string | null;
  serviceType?: ServiceType;
  ipQuantity?: number;
}) => {
  const { environment } = React.useContext(ShellContext);
  const hasMultipleIps = (ipQuantity ?? 1) > 1;
  const { data, ...query } = useCatalogIps({
    subsidiary: environment.user.ovhSubsidiary,
    enabled:
      !!serviceType &&
      (![ServiceType.dedicatedCloud, ServiceType.vps].includes(serviceType) ||
        hasMultipleIps),
  });

  const catalogGeolocations =
    data?.data?.plans
      ?.find((plan: CatalogIpPlan) => plan.planCode === planCode)
      ?.details.product.configurations.find(
        (config: CatalogIpConfiguration) => config.name === 'country',
      )
      ?.values.map((v: string) => v.toLowerCase()) || [];

  const { data: dedicatedServerData, ...dedicatedServerQuery } =
    useDedicatedServerGeolocations({
      serviceName,
      enabled:
        !!serviceName && !!serviceType && serviceType === ServiceType.server,
    });

  const { data: pccData, ...pccQuery } = useDedicatedCloudGeolocations({
    serviceName,
    enabled:
      !!serviceName &&
      !!serviceType &&
      serviceType === ServiceType.dedicatedCloud,
  });

  const { data: vpsData, ...vpsQuery } = useVpsGeolocations({
    serviceName,
    enabled: !!serviceName && !!serviceType && serviceType === ServiceType.vps,
  });

  switch (serviceType) {
    case ServiceType.server:
      return {
        ...dedicatedServerQuery,
        geolocations: hasMultipleIps
          ? catalogGeolocations
          : dedicatedServerData?.data || [],
      };
    case ServiceType.dedicatedCloud:
      return {
        ...pccQuery,
        geolocations: hasMultipleIps
          ? catalogGeolocations
          : pccData?.data || [],
      };
    case ServiceType.vps:
      return {
        ...vpsQuery,
        geolocations: hasMultipleIps
          ? catalogGeolocations
          : vpsData?.data || [],
      };
    default:
      return {
        ...query,
        geolocations: catalogGeolocations,
      };
  }
};
