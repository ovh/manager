import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { isBlockIpPlan } from './catalog.utils';
import {
  isRegionInEu,
  isRegionInUs,
} from '@/components/RegionSelector/region-selector.utils';
import { IpVersion } from '@/pages/order/order.constant';
import { useCatalogIps } from './useCatalogIps';

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
