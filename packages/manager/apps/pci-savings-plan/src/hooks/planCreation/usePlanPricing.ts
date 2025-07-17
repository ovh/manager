import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { getPlanPricing } from '@/utils/pricing/utils';
import { TPricingInfo } from '../useCatalogCommercial';

export type TPlanPricing = TPricingInfo & {
  monthlyPercentageDiscount: string;
  monthlyPrice: string;
  monthlyPriceWithoutDiscount: string;
};

export const usePlanPricing = ({
  pricingByDuration,
  quantity,
  activeHourlyPrice,
}: {
  pricingByDuration: TPricingInfo[];
  quantity: number;
  activeHourlyPrice: number;
}): TPlanPricing[] => {
  const { getTextPrice } = useCatalogPrice();

  const enrichedPricingByDuration = useMemo(() => {
    const hourlyPriceWithoutDiscount = activeHourlyPrice || 0;

    return pricingByDuration
      .map((pricing) =>
        getPlanPricing({
          pricing,
          quantity,
          hourlyPriceWithoutDiscount,
        }),
      )
      .map((p) => ({
        ...p,
        monthlyPrice: getTextPrice(p.monthlyPrice),
        monthlyPriceWithoutDiscount: getTextPrice(
          p.monthlyPriceWithoutDiscount,
        ),
      }));
  }, [pricingByDuration, activeHourlyPrice, getTextPrice, quantity]);

  return enrichedPricingByDuration;
};
