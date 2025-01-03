import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { getCatalogIps } from '../api/catalog';
import {
  DATACENTER_TO_REGION,
  IP_FAILOVER_PLANCODE,
  getCatalogIpsQueryKey,
  isBlockIpPlan,
} from './catalog.utils';
import {
  isRegionInEu,
  isRegionInUs,
} from '@/components/RegionSelector/region-selector.utils';
import { IpVersion } from '@/pages/order/order.constant';

const useCatalogIps = (subsidiary: string) =>
  useQuery({
    queryKey: getCatalogIpsQueryKey(subsidiary),
    queryFn: () => getCatalogIps(subsidiary as OvhSubsidiary),
  });

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

export const useAdditionalIpBlockPricings = (
  region: string,
  ipVersion: IpVersion,
) => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps(environment.user.ovhSubsidiary);

  const isEu = isRegionInEu(region);
  const isUs = isRegionInUs(region);

  return {
    ...query,
    pricingList:
      data.data.plans
        ?.filter((plan) =>
          plan.planCode.includes(ipVersion === IpVersion.ipv4 ? 'v4' : 'v6'),
        )
        .filter(isBlockIpPlan)
        .filter((plan) => {
          if (isUs) {
            return true;
          }
          return isEu
            ? plan.invoiceName.includes('EUROPE')
            : !plan.invoiceName.includes('EUROPE');
        })
        .map((plan) => ({
          label: `${plan.invoiceName.replace(/^.*\]\s*/, '')} - ${
            plan.details.pricings.default[0].price.text
          }`,
          value: plan.planCode,
          orderValue: plan.details.pricings.default[0].price.value,
        }))
        .sort((planA, planB) =>
          planA.orderValue > planB.orderValue ? 1 : -1,
        ) || [],
  };
};

export const useAvailableGeolocationFromPlanCode = (planCode: string) => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps(environment.user.ovhSubsidiary);
  const plan = data?.data?.plans?.find((plan) => plan.planCode === planCode);

  return {
    ...query,
    geolocations: plan?.details.product.configurations
      .find((config) => config.name === 'country')
      ?.values.map((v) => v.toLowerCase()),
  };
};
