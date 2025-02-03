import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DATACENTER_TO_REGION } from './catalog.utils';
import { useCatalogIps } from './useCatalogIps';
import { ServiceType } from '@/types';

export const useAdditionalIpsRegions = ({
  serviceType,
}: {
  serviceType: ServiceType;
}) => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps(environment.user.ovhSubsidiary);

  const configurationName =
    serviceType === ServiceType.vrack ? 'ip_region' : 'datacenter';

  return {
    ...query,
    regionList: data?.data?.plans
      ? Array.from(
          new Set(
            data.data.plans
              .filter(({ planCode }) => {
                switch (serviceType) {
                  case ServiceType.ipParking:
                    return planCode.includes('failover');
                  case ServiceType.vrack:
                    return planCode.includes('ip-v6');
                  default:
                    return planCode.includes('ip-v4');
                }
              })
              .map((plan) =>
                plan.details.product.configurations
                  .flatMap((config) =>
                    config.name === configurationName ? config : undefined,
                  )
                  .filter(Boolean)
                  .flatMap((config) => config.values),
              )
              .flat(),
          ),
        ).map(
          (regionOrDatacenter) =>
            DATACENTER_TO_REGION[regionOrDatacenter] || regionOrDatacenter,
        )
      : [],
  };
};
