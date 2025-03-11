import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { IP_FAILOVER_PLANCODE } from './catalog.utils';
import { useCatalogIps } from './useCatalogIps';
import { CatalogIpPlan } from '@/data/api';

const getLowestPlanPrice = (lowestPrice: number, plan: CatalogIpPlan) => {
  const currentPrice = plan?.details?.pricings?.default[0].priceInUcents;
  return currentPrice < lowestPrice ? currentPrice : lowestPrice;
};

export const useCatalogLowestPrice = () => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps({
    subsidiary: environment.user.ovhSubsidiary,
  });

  return {
    ...query,
    ipv4LowestPrice:
      data?.data?.plans
        .filter((plan) =>
          Object.values(IP_FAILOVER_PLANCODE).includes(plan.planCode),
        )
        .reduce(getLowestPlanPrice, Number.POSITIVE_INFINITY) ?? null,
    ipv6LowestPrice:
      data?.data?.plans
        .filter((plan) => plan.planCode.includes('ip-v6'))
        .reduce(getLowestPlanPrice, Number.POSITIVE_INFINITY) ?? null,
  };
};
