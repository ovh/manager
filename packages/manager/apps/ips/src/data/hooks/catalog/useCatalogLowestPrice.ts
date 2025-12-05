import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useCatalogIps } from './useCatalogIps';
import { CatalogIpPlan, PccCatalogPlan } from '@/data/api';

const isIpv6Plan = (plan: CatalogIpPlan | PccCatalogPlan) =>
  plan.planCode.includes('ip-v6');

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
        .filter((plan: CatalogIpPlan) => !isIpv6Plan(plan))
        .reduce(getLowestPlanPrice, Number.POSITIVE_INFINITY) ?? null,
    ipv6LowestPrice:
      data?.data?.plans
        .filter(isIpv6Plan)
        .reduce(getLowestPlanPrice, Number.POSITIVE_INFINITY) ?? null,
  };
};
