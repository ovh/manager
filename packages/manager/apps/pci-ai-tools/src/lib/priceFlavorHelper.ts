import ai from '@/types/AI';
import publicCatalog from '@/types/Catalog';
import { AppPricing, Flavor } from '@/types/orderFunnel';

export function createFlavorPricingList(
  flavors: ai.capabilities.Flavor[],
  catalog: publicCatalog.Catalog,
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
  catalog: publicCatalog.Catalog,
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
