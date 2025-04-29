import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useCatalogIps } from './useCatalogIps';
import { ServiceType } from '@/types';
import { useDedicatedCloudGeolocations } from './useDedicatedCloudGeolocations';
import { useVpsGeolocations } from './useVpsGeolocations';
import { CatalogIpConfiguration, CatalogIpPlan } from '@/data/api';
import { useDedicatedServerGeolocations } from './useDedicatedServerGeolocations';

export const useAvailableGeolocationFromPlanCode = ({
  planCode,
  serviceName,
  serviceType,
}: {
  planCode: string;
  serviceName: string;
  serviceType: ServiceType;
}) => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps({
    subsidiary: environment.user.ovhSubsidiary,
    enabled: ![ServiceType.dedicatedCloud, ServiceType.vps].includes(
      serviceType,
    ),
  });

  const {
    data: dedicatedServerData,
    ...dedicatedServerQuery
  } = useDedicatedServerGeolocations({
    serviceName,
    enabled: serviceType === ServiceType.server,
  });

  const { data: pccData, ...pccQuery } = useDedicatedCloudGeolocations({
    serviceName,
    enabled: serviceType === ServiceType.dedicatedCloud,
  });

  const { data: vpsData, ...vpsQuery } = useVpsGeolocations({
    serviceName,
    enabled: serviceType === ServiceType.vps,
  });

  switch (serviceType) {
    case ServiceType.server:
      return {
        ...dedicatedServerQuery,
        geolocations: dedicatedServerData?.data || [],
      };
    case ServiceType.dedicatedCloud:
      return {
        ...pccQuery,
        geolocations: pccData?.data || [],
      };
    case ServiceType.vps:
      return {
        ...vpsQuery,
        geolocations: vpsData?.data || [],
      };
    default:
      return {
        ...query,
        geolocations: data?.data?.plans
          ?.find((plan: CatalogIpPlan) => plan.planCode === planCode)
          ?.details.product.configurations.find(
            (config: CatalogIpConfiguration) => config.name === 'country',
          )
          ?.values.map((v: string) => v.toLowerCase()),
      };
  }
};
