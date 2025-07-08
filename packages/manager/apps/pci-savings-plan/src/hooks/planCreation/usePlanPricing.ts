import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { TPricingByDuration } from './useDefaultOffer';
import { getPlanPricing } from '@/utils/pricing/utils';

export type TPlanPricing = TPricingByDuration & {
  duration: number;
  monthlyPercentageDiscount: number;
  monthlyPrice: string;
  monthlyPriceWithoutDiscount: string;
};

export const usePlanPricing = ({
  pricingByDuration,
  quantity,
  activeHourlyPrice,
}: {
  pricingByDuration: TPricingByDuration[];
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
  }, [pricingByDuration]);

  return enrichedPricingByDuration;
};
