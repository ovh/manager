import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { isBlockIpPlan } from './catalog.utils';
import {
  isRegionInEu,
  isRegionInUs,
} from '@/components/RegionSelector/region-selector.utils';
import { DEFAULT_PRICING_MODE, IpVersion } from '@/pages/order/order.constant';
import { useCatalogIps } from './useCatalogIps';
import { usePccCatalog } from './usePccCatalog';
import { ServiceType } from '@/types';

const toOptionLabel = (planLabel: string, priceText: string) =>
  `${planLabel.replace(/^.*\]\s*/, '')} - ${priceText}`;

export const useAdditionalIpBlockPricings = ({
  region,
  ipVersion,
  serviceName,
  serviceType,
}: Partial<{
  region: string;
  ipVersion: IpVersion;
  serviceName: string;
  serviceType: ServiceType;
}>) => {
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
      pricingList:
        pccData?.data
          ?.filter((plan) => plan.family === 'ip')
          .sort((planA, planB) =>
            planA.prices[0].price.value > planB.prices[0].price.value ? 1 : -1,
          )
          .map((plan) => ({
            label: toOptionLabel(plan.productName, plan.prices[0].price.text),
            value: plan.planCode,
            pricingMode: plan.prices[0].pricingMode,
          })) || [],
    };
  }

  const isEu = isRegionInEu(region);
  const isUs = isRegionInUs(region);

  return {
    ...query,
    pricingList:
      data?.data?.plans
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
        .sort((planA, planB) =>
          planA.details.pricings.default[0].price.value >
          planB.details.pricings.default[0].price.value
            ? 1
            : -1,
        )
        .map((plan) => ({
          label: toOptionLabel(
            plan.invoiceName,
            plan.details.pricings.default[0].price.text,
          ),
          value: plan.planCode,
          pricingMode: DEFAULT_PRICING_MODE,
        })) || [],
  };
};
