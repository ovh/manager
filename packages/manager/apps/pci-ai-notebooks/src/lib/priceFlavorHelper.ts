import { order } from '@/types/catalog';
import * as ai from '@/types/cloud/project/ai';
import { AppPricing, Flavor } from '@/types/orderFunnel';

export function createFlavorPricingList(
  flavors: ai.capabilities.Flavor[],
  catalog: order.publicOrder.Catalog,
  productPrefix: string,
): Flavor[] {
  return flavors.map((flavor) => {
    const flavorPlanCode = `${productPrefix}.${flavor.id}.minute.consumption`;
    const flavorPrice = catalog.addons.find(
      (ad) => ad.planCode === flavorPlanCode,
    )?.pricings;
    return {
      ...flavor,
      pricing: flavorPrice,
    };
  });
}

export function getFlavorPricing(
  flavorId: string,
  catalog: order.publicOrder.Catalog,
  productPrefix: string,
): AppPricing {
  const flavorPlanCode = `${productPrefix}.${flavorId}.minute.consumption`;
  const flavorPrice = catalog.addons.find(
    (ad) => ad.planCode === flavorPlanCode,
  )?.pricings;
  return {
    price: flavorPrice[0].price,
    tax: flavorPrice[0].tax,
  };
}
