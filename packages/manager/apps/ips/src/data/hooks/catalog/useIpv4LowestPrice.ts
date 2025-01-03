import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { IP_FAILOVER_PLANCODE } from './catalog.utils';
import { useCatalogIps } from './useCatalogIps';

export const useIpv4LowestPrice = () => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps(environment.user.ovhSubsidiary);

  return {
    ...query,
    price:
      data?.data?.plans
        .filter((plan) =>
          Object.values(IP_FAILOVER_PLANCODE).includes(plan.planCode),
        )
        .reduce((lowestPrice, plan) => {
          const currentPrice = plan.details.pricings.default[0].priceInUcents;
          return currentPrice < lowestPrice ? currentPrice : lowestPrice;
        }, Number.POSITIVE_INFINITY) || null,
  };
};
