 import publicCatalog from '@/types/Catalog';
import { AppPricing, Qpu } from '@/types/orderFunnel';

export function createQPUFlavorPricingList(
  qpuFlavors: Qpu[],
  catalog: publicCatalog.Catalog,
  productPrefix: string,
): Qpu[] {
  return qpuFlavors.map((qpuFlavor) => {
    const qpuFlavorPlanCode = `${productPrefix}.${qpuFlavor.id}.minute.consumption`;
    const qpuFlavorPrice = catalog.addons.find(
      (ad) => ad.planCode === qpuFlavorPlanCode,
    )?.pricings;
    return {
      ...qpuFlavor,
      pricing: qpuFlavorPrice,
    };
  });
}

export function getFlavorPricing(
  qpuFlavorId: string,
  catalog: publicCatalog.Catalog,
  productPrefix: string,
): AppPricing {
  const  qpuFlavorPlanCode = `${productPrefix}.${qpuFlavorId}.minute.consumption`;
  const qpuFlavorPrice = catalog.addons.find(
    (ad) => ad.planCode === qpuFlavorPlanCode,
  )?.pricings;
  return {
    price: qpuFlavorPrice[0].price,
    tax: qpuFlavorPrice[0].tax,
  };
}
