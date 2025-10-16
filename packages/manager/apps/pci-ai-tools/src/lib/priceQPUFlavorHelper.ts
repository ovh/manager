import quantum from '@/types/Quantum';
import publicCatalog from '@/types/Catalog';
import { Qpu } from '@/types/orderFunnel';

export function createQpuFlavorPricingList(
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
      description: qpuFlavor.description,
      qubits: qpuFlavor.qubits,
      pricing: qpuFlavorPrice,
    };
    return qpu;
  });
}
