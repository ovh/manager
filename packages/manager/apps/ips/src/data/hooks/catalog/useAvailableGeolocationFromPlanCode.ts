import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useCatalogIps } from './useCatalogIps';
import { ServiceType } from '@/types';
import { useDedicatedCloudGeolocations } from './useDedicatedCloudGeolocations';
import { useVpsGeolocations } from './useVpsGeolocations';

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

  const { data: pccData, ...pccQuery } = useDedicatedCloudGeolocations({
    serviceName,
    enabled: serviceType === ServiceType.dedicatedCloud,
  });

  const { data: vpsData, ...vpsQuery } = useVpsGeolocations({
    serviceName,
    enabled: serviceType === ServiceType.vps,
  });

  switch (serviceType) {
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
          ?.find((plan) => plan.planCode === planCode)
          ?.details.product.configurations.find(
            (config) => config.name === 'country',
          )
          ?.values.map((v) => v.toLowerCase()),
      };
  }
};
