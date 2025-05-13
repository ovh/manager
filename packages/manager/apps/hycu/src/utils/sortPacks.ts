import { HYCUCatalogPlan } from '@/types/orderCatalogHYCU.type';

/**
 *
 * @param packs
 * @returns packs ordered by price
 */
export const sortPacksByPrice = (packs: HYCUCatalogPlan[]) => {
  return packs.sort((a, b) => a.pricings[2].price - b.pricings[2].price);
};
