import { FlavorWithRegion } from "@/hooks/api/ai/useGetFlavors";
import { order } from "@/models/catalog";
import { Flavor } from "@/models/order-funnel";

function setPrices (
  flavor: FlavorWithRegion,
  catalog: order.publicOrder.Catalog,
) {
  const pricing =
    catalog.addons.find(
      (a) => a.planCode === `ai-notebook.${flavor.id.toLowerCase()}.minute.consumption`,
    )?.pricings || [];
  return pricing[0];
}

export function createFlavorList (
  flavorsWithRegion: FlavorWithRegion[],
  region: string,
  catalog: order.publicOrder.Catalog,
) {
  const flavors: Flavor[] = flavorsWithRegion.map(
    (flavor: FlavorWithRegion) =>
      ({ ...flavor, pricing: setPrices(flavor, catalog) })
  ).filter((flav: Flavor) => flav.region === region)
  return flavors;
}

