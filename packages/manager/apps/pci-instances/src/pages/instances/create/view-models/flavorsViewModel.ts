import { Deps } from '@/deps/deps';
import {
  TFlavor,
  TInstancesCatalog,
  TMacroRegion,
  TRegionalizedFlavor,
} from '@/domain/entities/instancesCatalog';
import { TDeploymentMode } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';
import { getRegionNameKey } from './localizationsViewModel';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { MessageProviderPort } from '@/domain/port/messageProvider/left/port';

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

type TSelectFlavorMicroRegionsArgs = {
  projectId: string;
  unavailableFlavor: string | null;
};

export type TCustomRegionItemData = {
  countryCode: TCountryIsoCode | null;
  deploymentMode: TDeploymentMode;
  macroRegionId: string;
  regionalizedFlavorId: string;
};

type TMicroRegionId = string;
type TFlavorMicroRegionsData = {
  label: string;
  options: {
    customRendererData: TCustomRegionItemData;
    label: string;
    value: TMicroRegionId;
  }[];
};

const mapToAvailableRegionOption = (
  macroRegion: TMacroRegion,
  regionalizedFlavor: TRegionalizedFlavor,
  messageProviderPort: MessageProviderPort,
) => {
  const regionName = getRegionNameKey(
    macroRegion.deploymentMode,
    macroRegion.name,
  );

  const city = messageProviderPort.getMessage(
    `regions:manager_components_region_${regionName}`,
  );
  return {
    customRendererData: {
      countryCode: macroRegion.country,
      deploymentMode: macroRegion.deploymentMode,
      macroRegionId: macroRegion.name,
      regionalizedFlavorId: regionalizedFlavor.id,
    },
    label:
      macroRegion.microRegions.length > 1 ? regionalizedFlavor.regionID : city,
    value: regionalizedFlavor.regionID,
  };
};

export type TSelectFlavorMicroRegions = (
  args: TSelectFlavorMicroRegionsArgs,
) => TFlavorMicroRegionsData[];

const mapAvailableRegions = (
  regionalizedFlavorsWithStock: TRegionalizedFlavor[],
  data: TInstancesCatalog,
  messageProviderPort: MessageProviderPort,
) => {
  const optionsGroupedByContinent = new Map<string, TFlavorMicroRegionsData>();

  regionalizedFlavorsWithStock.forEach((regionalizedFlavor) => {
    const macroRegionId = data.entities.microRegions.byId.get(
      regionalizedFlavor.regionID,
    )?.macroRegionId;
    if (!macroRegionId) return;

    const macroRegion = data.entities.macroRegions.byId.get(macroRegionId);
    if (!macroRegion) return;

    const continentId = macroRegion.continentIds[0];
    if (!continentId) return;

    const option = mapToAvailableRegionOption(
      macroRegion,
      regionalizedFlavor,
      messageProviderPort,
    );

    if (!optionsGroupedByContinent.has(continentId)) {
      optionsGroupedByContinent.set(continentId, {
        label: continentId,
        options: [option],
      });
    } else {
      optionsGroupedByContinent.get(continentId)!.options.push(option);
    }
  });

  return Array.from(optionsGroupedByContinent.values());
};

export const selectAvailableFlavorMicroRegions: Reader<
  Deps,
  TSelectFlavorMicroRegions
> = (deps) => {
  return ({ projectId, unavailableFlavor }) => {
    if (!unavailableFlavor) return [];
    const { instancesCatalogPort, messageProviderPort } = deps;

    const data = instancesCatalogPort.selectInstancesCatalog(projectId);
    if (!data) return [];

    const regionalizedFlavorIds =
      data.entities.flavors.byId.get(unavailableFlavor)
        ?.regionalizedFlavorIds ?? [];

    const regionalizedFlavorsWithStock = regionalizedFlavorIds.flatMap(
      (regionalizedFlavorId) => {
        const regionalizedFlavor = data.entities.regionalizedFlavors.byId.get(
          regionalizedFlavorId,
        );

        return regionalizedFlavor?.hasStock ? [regionalizedFlavor] : [];
      },
    );

    const availableRegions = mapAvailableRegions(
      regionalizedFlavorsWithStock,
      data,
      messageProviderPort,
    );

    return availableRegions;
  };
};
