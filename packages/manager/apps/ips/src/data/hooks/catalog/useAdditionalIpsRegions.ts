import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DATACENTER_TO_REGION } from './catalog.utils';
import { useCatalogIps } from './useCatalogIps';

export const useAdditionalIpsRegions = () => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps(environment.user.ovhSubsidiary);

  return {
    ...query,
    regionList: data?.data?.plans
      ? Array.from(
          new Set(
            data.data.plans
              .filter((plan) => plan.planCode.includes('v4'))
              .map((plan) =>
                plan.details.product.configurations
                  .flatMap((config) =>
                    config.name === 'datacenter' ? config : undefined,
                  )
                  .filter(Boolean)
                  .flatMap((config) => config.values),
              )
              .flat(),
          ),
        ).map((datacenter) => DATACENTER_TO_REGION[datacenter])
      : [],
  };
};
