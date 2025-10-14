import quantum from '@/types/Quantum';
import publicCatalog from '@/types/Catalog';
import { AppPricing, Qpu } from '@/types/orderFunnel';

export function createQPUFlavorPricingList(
  qpuFlavors: quantum.capabilities.QPUFlavor[],
  catalog: publicCatalog.Catalog,
  productPrefix: string,
): Qpu[] {
  return qpuFlavors.map((qpuFlavor) => {
    const qpuFlavorPlanCode = `${productPrefix}.${qpuFlavor.id}.unit.consumption`;
    const qpuFlavorPrice =
      catalog.addons.find((ad) => ad.planCode === qpuFlavorPlanCode)
        ?.pricings || [];

    const qpu: Qpu = {
      id: qpuFlavor.id,
      name: qpuFlavor.name,
      type: 'QPU',
      default: false,
      description: qpuFlavor.description,
      qubits: qpuFlavor.qubits,
      pricing: qpuFlavorPrice,
      resourcesPerUnit: {
        cpu: 0,
        memory: 0,
        ephemeralStorage: 0,
        privateNetwork: 0,
        publicNetwork: 0,
      },
    };
    return qpu;
  });
}

export function getQPUFlavorPricing(
  qpuFlavorId: string,
  catalog: publicCatalog.Catalog,
  productPrefix: string,
): AppPricing {
  const qpuFlavorPlanCode = `${productPrefix}.${qpuFlavorId}.unit.consumption`;
  const qpuFlavorPrice = catalog.addons.find(
    (ad) => ad.planCode === qpuFlavorPlanCode,
  )?.pricings;
  if (!qpuFlavorPrice?.length) {
    return { price: 0, tax: 0 };
  }
  return {
    price: qpuFlavorPrice[0].price,
    tax: qpuFlavorPrice[0].tax,
  };
}
