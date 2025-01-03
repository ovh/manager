import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { getCatalogIps } from '../api/catalog';
import {
  DATACENTER_TO_REGION,
  IP_FAILOVER_PLANCODE,
  getCatalogIpsQueryKey,
} from './catalog.constant';

export const useIpv4LowestPrice = () => {
  const { environment } = React.useContext(ShellContext);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: getCatalogIpsQueryKey(environment.user.ovhSubsidiary),
    queryFn: () =>
      getCatalogIps(environment.user.ovhSubsidiary as OvhSubsidiary),
  });

  return {
    isLoading,
    isError,
    error,
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

export const useAdditionalIpsRegions = () => {
  const { environment } = React.useContext(ShellContext);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: getCatalogIpsQueryKey(environment.user.ovhSubsidiary),
    queryFn: () =>
      getCatalogIps(environment.user.ovhSubsidiary as OvhSubsidiary),
  });

  console.log();
  return {
    isLoading,
    isError,
    error,
    regionList: data?.data?.plans
      ? Array.from(
          new Set(
            data.data.plans
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
