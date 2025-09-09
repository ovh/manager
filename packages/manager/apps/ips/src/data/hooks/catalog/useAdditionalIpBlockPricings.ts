import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { UseQueryResult } from '@tanstack/react-query';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import {
  getContinentKeyFromRegion,
  isAdditionalIpPlan,
  isBlockIpPlan,
} from './catalog.utils';
import {
  isRegionInAp,
  isRegionInCa,
  isRegionInUs,
} from '@/components/RegionSelector/region-selector.utils';
import { DEFAULT_PRICING_MODE } from '@/pages/order/order.constant';
import { useCatalogIps } from './useCatalogIps';
import { usePccCatalog } from './usePccCatalog';
import { ServiceType, IpVersion } from '@/types';
import {
  CatalogIpPlan,
  CatalogIpsResponse,
  PccCatalogPlan,
  PccCatalogResponse,
} from '@/data/api';

export type Pricing = {
  label: string;
  value: string;
  pricingMode: string;
};

export type UseAdditionalIpPricingsResult = UseQueryResult<
  ApiResponse<CatalogIpsResponse | PccCatalogResponse>,
  ApiError
> & { additionalIpPlanCode?: string; ipBlockPricingList: Pricing[] };

const toOptionLabel = (planLabel: string, priceText: string) =>
  `${planLabel.replace(/^.*\]\s*/, '')} - ${priceText}`;

export const useAdditionalIpPricings = ({
  region,
  ipVersion,
  serviceName,
  serviceType,
}: {
  region: string;
  ipVersion: IpVersion;
  serviceName: string;
  serviceType: ServiceType;
}) => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps({
    subsidiary: environment.user.ovhSubsidiary,
    enabled: !!region && serviceType !== ServiceType.dedicatedCloud,
  });

  const { data: pccData, ...pccQuery } = usePccCatalog({
    serviceName,
    enabled: serviceType === ServiceType.dedicatedCloud,
  });

  if (serviceType === ServiceType.dedicatedCloud) {
    return {
      ...pccQuery,
      additionalIpPlanCode: undefined,
      ipBlockPricingList: (pccData?.data
        ?.filter((plan: PccCatalogPlan) => plan.family === 'ip')
        .sort((planA: PccCatalogPlan, planB: PccCatalogPlan) =>
          planA.prices[0].price.value > planB.prices[0].price.value ? 1 : -1,
        )
        .map((plan: PccCatalogPlan) => ({
          label: toOptionLabel(plan.productName, plan.prices[0].price.text),
          value: plan.planCode,
          pricingMode: plan.prices[0].pricingMode,
        })) || []) as Pricing[],
    } as UseAdditionalIpPricingsResult;
  }

  const isUs = isRegionInUs(region);
  const isCa = isRegionInCa(region);
  const isApac = isRegionInAp(region);

  return {
    ...query,
    additionalIpPlanCode: data?.data?.plans
      ?.filter(isAdditionalIpPlan)
      ?.find((plan: CatalogIpPlan) =>
        plan.invoiceName.includes(getContinentKeyFromRegion(region)),
      )?.planCode as string,
    ipBlockPricingList: (data?.data?.plans
      ?.filter((plan: CatalogIpPlan) =>
        plan.planCode.includes(ipVersion === IpVersion.ipv4 ? 'v4' : 'v6'),
      )
      .filter(isBlockIpPlan)
      .filter((plan: CatalogIpPlan) => {
        if (isUs) {
          return plan.invoiceName.includes('USA');
        }
        if (isCa) {
          return plan.invoiceName.includes('CANADA');
        }
        return isApac
          ? plan.invoiceName.includes('APAC') ||
              plan.invoiceName.includes('ASIA')
          : plan.invoiceName.includes('EUROPE');
      })
      .sort((planA: CatalogIpPlan, planB: CatalogIpPlan) =>
        planA.details.pricings.default[0].price.value >
        planB.details.pricings.default[0].price.value
          ? 1
          : -1,
      )
      .map((plan: CatalogIpPlan) => ({
        label: toOptionLabel(
          plan.invoiceName,
          plan.details.pricings.default[0].price.text,
        ),
        value: plan.planCode,
        pricingMode: DEFAULT_PRICING_MODE,
      })) || []) as Pricing[],
  } as UseAdditionalIpPricingsResult;
};
