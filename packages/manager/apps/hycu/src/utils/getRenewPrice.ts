import { HYCUCatalogPlanPricing } from '@/types/orderCatalogHYCU.type';

/**
 *
 * @param pricings
 * @returns pricing which correspond to renew capacity
 */
export const getRenewPrice = (
  pricings: HYCUCatalogPlanPricing[],
): HYCUCatalogPlanPricing => {
  return pricings.find((pricing) =>
    pricing.capacities.find((capacity) => capacity === 'renew'),
  );
};
