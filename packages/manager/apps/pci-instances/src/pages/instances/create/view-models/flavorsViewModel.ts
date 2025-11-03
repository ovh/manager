import { Deps } from '@/deps/deps';
import { TDeploymentMode } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';

export type TFlavorData = {
  id: string;
  unavailable: boolean;
  unavailableQuota: boolean;
  name: string;
  memory: number;
  vCore: number;
  storage: number;
  bandwidthPublic: string;
  bandwidthPrivate: string;
  mode: TDeploymentMode;
  hourlyPrice?: number;
  monthlyPrice?: number;
};

export type TFlavorDataForTable = Omit<
  TFlavorData,
  'bandwidthPublic' | 'bandwidthPrivate'
>;

export type TGpuFlavorData = {
  id: string;
  unavailable: boolean;
  unavailableQuota: boolean;
  name: string;
  gpu: string;
  numberOfGpu: number;
  vRamTotal: number;
  memory: number;
  vCore: number;
  storage: number;
  bandwidthPublic: string;
  bandwidthPrivate: string;
  hourlyPrice: number;
  monthlyPrice: number;
};

export type TGpuFlavorDataForTable = Omit<
  TGpuFlavorData,
  'bandwidthPublic' | 'bandwidthPrivate'
>;

// export type TFlavorDataForCart = {
//   id: string;
//   name: string;
//   memory: number;
//   gpu?: string;
//   numberOfGpu?: number;
//   vCore: number;
//   vRamTotal?: number;
//   storage: number;
//   bandwidthPublic: string;
//   bandwidthPrivate: string;
// };

export const mapFlavorToTable = (flavor: TFlavorData): TFlavorDataForTable => ({
  id: flavor.id,
  unavailable: flavor.unavailable,
  unavailableQuota: flavor.unavailableQuota,
  name: flavor.name,
  memory: flavor.memory,
  vCore: flavor.vCore,
  storage: flavor.storage,
  mode: flavor.mode,
  hourlyPrice: flavor.hourlyPrice,
  monthlyPrice: flavor.monthlyPrice,
});

export const mapGpuFlavorToTable = (
  gpuFlavor: TGpuFlavorData,
): TGpuFlavorDataForTable => ({
  id: gpuFlavor.id,
  unavailable: gpuFlavor.unavailable,
  unavailableQuota: gpuFlavor.unavailableQuota,
  name: gpuFlavor.name,
  gpu: gpuFlavor.gpu,
  numberOfGpu: gpuFlavor.numberOfGpu,
  vRamTotal: gpuFlavor.vRamTotal,
  memory: gpuFlavor.memory,
  vCore: gpuFlavor.vCore,
  storage: gpuFlavor.storage,
  hourlyPrice: gpuFlavor.hourlyPrice,
  monthlyPrice: gpuFlavor.monthlyPrice,
});

export type TSelectFlavors = (
  projectId: string,
  flavorType: string | null,
  microRegionId: string | null,
) => TFlavorDataForTable[];

// TODO: will be optimized in next PR
// eslint-disable-next-line max-lines-per-function
export const selectFlavors: Reader<Deps, TSelectFlavors> = (deps) => (
  projectId,
  flavorType,
  microRegionId,
) => {
  if (!flavorType || !microRegionId) return [];

  const { instancesCatalogPort } = deps;
  const data = instancesCatalogPort.selectInstancesCatalog(projectId);
  if (!data) return [];

  const flavorsNames = data.entities.flavorTypes.byId.get(flavorType)?.flavors;

  if (!flavorsNames) return [];

  return flavorsNames.reduce<TFlavorDataForTable[]>((acc, flavorName) => {
    const flavor = data.entities.flavors.byId.get(flavorName);

    if (!flavor) return acc;

    const regionalizedFlavors = flavor.regionalizedFlavorIds.flatMap(
      (regionalizedFlavorId) =>
        data.entities.regionalizedFlavors.byId.get(regionalizedFlavorId) ?? [],
    );

    regionalizedFlavors.map((regionalizedFlavor) => {
      const macroRegionId = data.entities.microRegions.byId.get(
        regionalizedFlavor.regionID,
      )?.macroRegionId;
      if (!macroRegionId) return acc;

      const deploymentMode = data.entities.macroRegions.byId.get(macroRegionId)
        ?.deploymentMode;

      if (!deploymentMode) return acc;

      const pricing = data.entities.flavorPrices.byId.get(
        regionalizedFlavor.priceId,
      );

      if (!pricing) return acc;

      const hourlyPrice = pricing.prices.find((price) => price.type === 'hour')
        ?.value;
      const monthlyPrice = pricing.prices.find(
        (price) => price.type === 'month',
      )?.value;

      if (regionalizedFlavor.regionID === microRegionId)
        acc.push({
          id: regionalizedFlavor.id,
          unavailable: !regionalizedFlavor.availableStocks,
          unavailableQuota: !regionalizedFlavor.quota,
          name: flavor.name,
          memory: flavor.specifications.ram.value,
          vCore: flavor.specifications.cpu.value,
          storage: flavor.specifications.storage.value,
          mode: deploymentMode,
          hourlyPrice: hourlyPrice,
          monthlyPrice: monthlyPrice,
        });
    });

    return acc;
  }, []);
};
