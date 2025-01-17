import { useMemo } from 'react';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  RancherPlan,
  TRancherPricing,
  RancherPlanName,
} from '@/types/api.type';

export const useFormattedRancherPrices = (
  plans: RancherPlan[],
  pricing?: TRancherPricing[],
) => {
  const { getFormattedCatalogPrice: hourly } = useCatalogPrice(5);
  const { getFormattedCatalogPrice: monthly } = useCatalogPrice(2);
  const { t } = useTranslation('order-price');

  return useMemo(() => {
    return plans?.reduce((acc, plan) => {
      const pricingItem = pricing?.find((p) => p.name === plan.name);
      return {
        ...acc,
        [plan.name]: pricingItem
          ? {
              hourly: `${hourly(pricingItem.hourlyPrice)} /vCPU/${t(
                'order_catalog_price_interval_hour',
              )}`,
              monthly: `${monthly(pricingItem.monthlyPrice)} /vCPU/${t(
                'order_catalog_price_interval_month',
              )}`,
            }
          : null,
      };
    }, {}) as Record<
      RancherPlanName,
      { hourly: string; monthly: string | null }
    >;
  }, [plans, pricing, hourly, monthly]);
};
