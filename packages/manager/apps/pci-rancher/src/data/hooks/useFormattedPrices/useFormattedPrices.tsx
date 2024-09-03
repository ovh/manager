import { useMemo } from 'react';
import { useCatalogPrice } from '@ovhcloud/manager-components';
import {
  RancherPlan,
  TRancherPricing,
  RancherPlanName,
} from '@/types/api.type';

export const useFormattedRancherPrices = (
  plans: RancherPlan[],
  pricing?: TRancherPricing[],
) => {
  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);
  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(2);

  return useMemo(() => {
    return plans?.reduce((acc, plan) => {
      const pricingItem = pricing?.find((p) => p.name === plan.name);
      return {
        ...acc,
        [plan.name]: pricingItem
          ? {
              hourly: getFormattedHourlyCatalogPrice(pricingItem.hourlyPrice),
              monthly: getFormattedMonthlyCatalogPrice(
                pricingItem.monthlyPrice,
              ),
            }
          : null,
      };
    }, {}) as Record<
      RancherPlanName,
      { hourly: string; monthly: string | null }
    >;
  }, [
    plans,
    pricing,
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  ]);
};
