import { order } from '@/types/catalog';
import * as ai from '@/types/cloud/project/ai';
import { Flavor } from '@/types/orderFunnel';

export function createFlavorPricingList(
  flavors: ai.capabilities.Flavor[],
  catalog: order.publicOrder.Catalog,
): Flavor[] {
  return flavors.map((flavor) => {
    const flavorPlanCode = `ai-notebook.${flavor.id}.minute.consumption`;
    const flavorPrice = catalog.addons.find(
      (ad) => ad.planCode === flavorPlanCode,
    )?.pricings;
    return {
      ...flavor,
      pricing: flavorPrice,
    };
  });
}
