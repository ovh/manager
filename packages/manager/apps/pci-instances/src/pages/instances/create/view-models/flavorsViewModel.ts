import { Deps } from '@/deps/deps';
import {
  TFlavor,
  TInstancesCatalog,
  TRegionalizedFlavor,
} from '@/domain/entities/instancesCatalog';
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
  mode: TDeploymentMode | null;
  hourlyPrice: number | null;
  monthlyPrice: number | null;
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
  mode: TDeploymentMode | null;
  hourlyPrice: number | null;
  monthlyPrice: number | null;
};

export type TGpuFlavorDataForTable = Omit<
  TGpuFlavorData,
  'bandwidthPublic' | 'bandwidthPrivate'
>;

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
  mode: gpuFlavor.mode,
  memory: gpuFlavor.memory,
  vCore: gpuFlavor.vCore,
  storage: gpuFlavor.storage,
  hourlyPrice: gpuFlavor.hourlyPrice,
  monthlyPrice: gpuFlavor.monthlyPrice,
});

type TSelectFlavorsArgs = {
  projectId: string;
  flavorType: string | null;
  microRegionId: string | null;
  withUnavailable: boolean;
};

export type TSelectFlavors = (
  args: TSelectFlavorsArgs,
) => TFlavorDataForTable[];

const addMicroRegionAvailableFlavor = (
  acc: TFlavorDataForTable[],
  entities: TInstancesCatalog['entities'],
  regionalizedFlavor: TRegionalizedFlavor,
  flavor: TFlavor,
) => {
  const { microRegions, macroRegions, flavorPrices } = entities;

  const macroRegionId = microRegions.byId.get(regionalizedFlavor.regionID)
    ?.macroRegionId;
  if (!macroRegionId) return acc;

  const deploymentMode = macroRegions.byId.get(macroRegionId)?.deploymentMode;
  if (!deploymentMode) return acc;

  const pricing = flavorPrices.byId.get(regionalizedFlavor.priceId);
  if (!pricing) return acc;

  const hourlyPrice =
    pricing.prices.find((price) => price.type === 'hour')?.value ?? null;
  const monthlyPrice =
    pricing.prices.find((price) => price.type === 'month')?.value ?? null;

  acc.push({
    id: regionalizedFlavor.id,
    unavailable: !regionalizedFlavor.hasStock,
    unavailableQuota: !regionalizedFlavor.quota,
    name: flavor.name,
    memory: flavor.specifications.ram.value,
    vCore: flavor.specifications.cpu.value,
    storage: flavor.specifications.storage.value,
    mode: deploymentMode,
    hourlyPrice: hourlyPrice,
    monthlyPrice: monthlyPrice,
  });

  return acc;
};

const addUnavailableMicroRegionFlavor = (
  acc: TFlavorDataForTable[],
  flavor: TFlavor,
) => {
  const isFlavorAlreadyPresent = acc.find((fl) => fl.name === flavor.name);

  if (isFlavorAlreadyPresent) return acc;

  acc.push({
    id: flavor.name,
    unavailable: true,
    unavailableQuota: false,
    name: flavor.name,
    memory: flavor.specifications.ram.value,
    vCore: flavor.specifications.cpu.value,
    storage: flavor.specifications.storage.value,
    mode: null,
    hourlyPrice: null,
    monthlyPrice: null,
  });

  return acc;
};

export const selectFlavors: Reader<Deps, TSelectFlavors> = (deps) => {
  return ({ projectId, flavorType, microRegionId, withUnavailable }) => {
    if (!flavorType || !microRegionId) return [];

    const { instancesCatalogPort } = deps;
    const data = instancesCatalogPort.selectInstancesCatalog(projectId);
    if (!data) return [];

    const flavorsNames = data.entities.flavorTypes.byId.get(flavorType)
      ?.flavors;
    if (!flavorsNames) return [];

    return flavorsNames.reduce<TFlavorDataForTable[]>((acc, flavorName) => {
      const flavor = data.entities.flavors.byId.get(flavorName);
      if (!flavor) return acc;

      const regionalizedFlavors = flavor.regionalizedFlavorIds.flatMap(
        (regionalizedFlavorId) =>
          data.entities.regionalizedFlavors.byId.get(regionalizedFlavorId) ??
          [],
      );

      regionalizedFlavors.map((regionalizedFlavor, index) => {
        const isFlavorInSelectedMicroRegion =
          regionalizedFlavor.regionID === microRegionId;

        const isLastRegionalizedFlavorFromList =
          index === regionalizedFlavors.length - 1;

        const shouldAddUnavailableMicroRegionFlavor =
          withUnavailable &&
          isLastRegionalizedFlavorFromList &&
          !isFlavorInSelectedMicroRegion;

        if (isFlavorInSelectedMicroRegion)
          addMicroRegionAvailableFlavor(
            acc,
            data.entities,
            regionalizedFlavor,
            flavor,
          );

        if (shouldAddUnavailableMicroRegionFlavor)
          addUnavailableMicroRegionFlavor(acc, flavor);
      });

      return acc;
    }, []);
  };
};
