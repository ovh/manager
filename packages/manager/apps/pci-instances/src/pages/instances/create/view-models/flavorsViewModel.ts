/* eslint-disable max-lines */
import { Deps } from '@/deps/deps';
import {
  TFlavor,
  TFlavorPrices,
  TInstancesCatalog,
  TMacroRegion,
  TRegionalizedFlavor,
} from '@/domain/entities/instancesCatalog';
import { TDeploymentMode } from '@/types/instance/common.type';
import { Reader } from '@/types/utils.type';
import { getRegionNameKey } from './localizationsViewModel';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import {
  getRegionalizedFlavorId,
  getRegionalizedFlavorOsTypePriceId,
} from '@/utils';
import { mapDisksToViewModel, TDiskViewModel } from './mappers/diskMapper';

type TSelectFlavorsArgs = {
  projectId: string;
  flavorType: string | null;
  microRegionId: string | null;
  withUnavailable: boolean;
};

type TMinimumPrices = {
  realMinimumHourlyPrice: number | null;
  realMinimumMonthlyPrice: number | null;
  estimatedMinimumMonthlyPrice: number | null;
};

export const getMinimumPrices = (pricings: TFlavorPrices[]) =>
  pricings.reduce<TMinimumPrices>(
    (acc, pricing) => {
      pricing.prices.forEach(({ price, type, monthlyEquivalent }) => {
        if (
          type === 'hour' &&
          (!acc.realMinimumHourlyPrice ||
            acc.realMinimumHourlyPrice > price.priceInUcents)
        ) {
          acc.realMinimumHourlyPrice = price.priceInUcents;
        }

        if (
          type === 'month' &&
          (!acc.realMinimumMonthlyPrice ||
            acc.realMinimumMonthlyPrice > price.priceInUcents)
        ) {
          acc.realMinimumMonthlyPrice = price.priceInUcents;
        }

        if (
          monthlyEquivalent &&
          (!acc.estimatedMinimumMonthlyPrice ||
            acc.estimatedMinimumMonthlyPrice > monthlyEquivalent.priceInUcents)
        ) {
          acc.estimatedMinimumMonthlyPrice = monthlyEquivalent.priceInUcents;
        }
      });
      return acc;
    },
    {
      realMinimumHourlyPrice: null,
      realMinimumMonthlyPrice: null,
      estimatedMinimumMonthlyPrice: null,
    },
  );

type TFlavorEnricher<T extends TBaseFlavorDataForTable> = (
  base: TBaseFlavorDataForTable,
  flavor: TFlavor,
) => T;

const enrichCpuFlavor: TFlavorEnricher<TFlavorDataForTable> = (base) => base;

const enrichGpuFlavor: TFlavorEnricher<TGpuFlavorDataForTable> = (
  base,
  flavor,
) => ({
  ...base,
  gpu: flavor.specifications.gpu?.model.unit,
  numberOfGpu: flavor.specifications.gpu?.model.value,
  vRamTotal: flavor.specifications.gpu?.memory.size.value,
});

type TProcessFlavorContext<T extends TBaseFlavorDataForTable> = {
  entities: TInstancesCatalog['entities'];
  microRegionId: string;
  withUnavailable: boolean;
  enrichFlavor: TFlavorEnricher<T>;
};

const processRegionalizedFlavors = <T extends TBaseFlavorDataForTable>(
  acc: T[],
  flavor: TFlavor,
  flavorName: string,
  context: TProcessFlavorContext<T>,
) => {
  const { entities, microRegionId, withUnavailable, enrichFlavor } = context;

  const regionalizedFlavors = flavor.regionalizedFlavorIds.flatMap(
    (regionalizedFlavorId) =>
      entities.regionalizedFlavors.byId.get(regionalizedFlavorId) ?? [],
  );

  regionalizedFlavors.forEach((regionalizedFlavor, index) => {
    const regionalizedFlavorId = getRegionalizedFlavorId(
      flavorName,
      microRegionId,
    );

    const isFlavorInSelectedMicroRegion =
      regionalizedFlavor.id === regionalizedFlavorId;

    const isLastRegionalizedFlavorFromList =
      index === regionalizedFlavors.length - 1;

    const shouldAddUnavailableMicroRegionFlavor =
      withUnavailable &&
      isLastRegionalizedFlavorFromList &&
      !isFlavorInSelectedMicroRegion;

    if (isFlavorInSelectedMicroRegion) {
      addFlavor(acc, {
        entities,
        regionalizedFlavor,
        flavor,
        enrichFlavor,
      });
    }

    if (shouldAddUnavailableMicroRegionFlavor) {
      addUnavailableFlavor(acc, flavor, enrichFlavor, entities);
    }
  });
};

const selectFlavorsInternal = <T extends TBaseFlavorDataForTable>(
  args: TSelectFlavorsArgs,
  data: TInstancesCatalog,
  enrichFlavor: TFlavorEnricher<T>,
): { flavors: T[]; preselectedFlavordId: string | null } => {
  const { flavorType, microRegionId, withUnavailable } = args;

  if (!flavorType || !microRegionId) {
    return { flavors: [], preselectedFlavordId: null };
  }

  const flavorsNames = data.entities.flavorTypes.byId.get(flavorType)?.flavors;
  if (!flavorsNames) {
    return { flavors: [], preselectedFlavordId: null };
  }

  const context: TProcessFlavorContext<T> = {
    entities: data.entities,
    microRegionId,
    withUnavailable,
    enrichFlavor,
  };

  const flavorsData = flavorsNames.reduce<T[]>((acc, flavorName) => {
    const flavor = data.entities.flavors.byId.get(flavorName);
    if (!flavor) return acc;

    processRegionalizedFlavors(acc, flavor, flavorName, context);

    return acc;
  }, []);

  const preselectedFirstAvailableFlavorId =
    flavorsData.find(
      (flavor) => !flavor.unavailable && !flavor.unavailableQuota,
    )?.id ?? null;

  return {
    flavors: flavorsData,
    preselectedFlavordId: preselectedFirstAvailableFlavorId,
  };
};

type TSelectUnifiedFlavorsArgs = TSelectFlavorsArgs & {
  flavorCategory: string | null;
};

type TSelectFlavorsResult = {
  flavors: TBaseFlavorDataForTable[];
  preselectedFlavordId: string | null;
  isGpu: boolean;
};

export type TSelectFlavors = (
  args: TSelectUnifiedFlavorsArgs,
) => TSelectFlavorsResult;

export const selectFlavors: Reader<Deps, TSelectFlavors> = (deps) => {
  return (args) => {
    const { flavorCategory, ...rest } = args;
    const isGpu = flavorCategory === 'Cloud GPU';

    const { instancesCatalogPort } = deps;
    const data = instancesCatalogPort.selectInstancesCatalog(args.projectId);

    if (!data) {
      return { flavors: [], preselectedFlavordId: null, isGpu };
    }

    const enricher = isGpu ? enrichGpuFlavor : enrichCpuFlavor;
    const result = selectFlavorsInternal(rest, data, enricher);

    return {
      flavors: isGpu
        ? (result.flavors as TGpuFlavorDataForTable[])
        : result.flavors,
      preselectedFlavordId: result.preselectedFlavordId,
      isGpu,
    };
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
  regionId: string;
};

type TMicroRegionId = string;
type TFlavorMicroRegionsData = {
  label: string;
  options: {
    customRendererData: TCustomRegionItemData;
    value: TMicroRegionId;
  }[];
};

const mapToAvailableRegionOption = (
  macroRegion: TMacroRegion,
  regionalizedFlavor: TRegionalizedFlavor,
) => {
  const regionName = getRegionNameKey(
    macroRegion.deploymentMode,
    macroRegion.name,
  );

  const label = `regions:manager_components_region_${regionName}_micro`;

  return {
    customRendererData: {
      countryCode: macroRegion.country,
      deploymentMode: macroRegion.deploymentMode,
      macroRegionId: macroRegion.name,
      regionalizedFlavorId: regionalizedFlavor.id,
      regionId: regionalizedFlavor.regionId,
    },
    label,
    value: regionalizedFlavor.regionId,
  };
};

export type TSelectFlavorMicroRegions = (
  args: TSelectFlavorMicroRegionsArgs,
) => TFlavorMicroRegionsData[];

const mapAvailableRegions = (
  regionalizedFlavorsWithStock: TRegionalizedFlavor[],
  data: TInstancesCatalog,
) => {
  const optionsGroupedByContinent = new Map<string, TFlavorMicroRegionsData>();

  regionalizedFlavorsWithStock.forEach((regionalizedFlavor) => {
    const macroRegionId = data.entities.microRegions.byId.get(
      regionalizedFlavor.regionId,
    )?.macroRegionId;
    if (!macroRegionId) return;

    const macroRegion = data.entities.macroRegions.byId.get(macroRegionId);
    if (!macroRegion) return;

    const continentId = macroRegion.continentIds[0];
    if (!continentId) return;

    const option = mapToAvailableRegionOption(macroRegion, regionalizedFlavor);

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
    const { instancesCatalogPort } = deps;

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

        return regionalizedFlavor?.hasStock && regionalizedFlavor.quota
          ? [regionalizedFlavor]
          : [];
      },
    );

    const availableRegions = mapAvailableRegions(
      regionalizedFlavorsWithStock,
      data,
    );

    return availableRegions;
  };
};

export type TBaseFlavorDataForTable = {
  id: string;
  unavailable: boolean;
  unavailableQuota: boolean;
  hasNoAvailableRegions: boolean;
  name: string;
  memory: number;
  vCore: number;
  disks: TDiskViewModel[];
  mode: TDeploymentMode | null;
  realMinimumHourlyPrice: number | null;
  realMinimumMonthlyPrice: number | null;
  estimatedMinimumMonthlyPrice: number | null;
};

export type TFlavorDataForTable = TBaseFlavorDataForTable;

export type TGpuFlavorDataForTable = TBaseFlavorDataForTable & {
  gpu?: string;
  numberOfGpu?: number;
  vRamTotal?: number;
};

const buildBaseFlavorForTable = (
  entities: TInstancesCatalog['entities'],
  regionalizedFlavor: TRegionalizedFlavor,
  flavor: TFlavor,
): TBaseFlavorDataForTable | null => {
  const { microRegions, macroRegions } = entities;

  const macroRegionId = microRegions.byId.get(regionalizedFlavor.regionId)
    ?.macroRegionId;
  if (!macroRegionId) return null;

  const deploymentMode = macroRegions.byId.get(macroRegionId)?.deploymentMode;
  if (!deploymentMode) return null;

  return {
    id: regionalizedFlavor.id,
    unavailable: !regionalizedFlavor.hasStock,
    unavailableQuota: !regionalizedFlavor.quota,
    hasNoAvailableRegions: false,
    name: flavor.name,
    memory: flavor.specifications.ram.value,
    vCore: flavor.specifications.cpu.value,
    disks: mapDisksToViewModel(flavor.specifications.disks),
    mode: deploymentMode,
    realMinimumHourlyPrice: null,
    realMinimumMonthlyPrice: null,
    estimatedMinimumMonthlyPrice: null,
  };
};

type TAddFlavorParams<T extends TBaseFlavorDataForTable> = {
  entities: TInstancesCatalog['entities'];
  regionalizedFlavor: TRegionalizedFlavor;
  flavor: TFlavor;
  enrichFlavor: TFlavorEnricher<T>;
};

const addFlavor = <T extends TBaseFlavorDataForTable>(
  acc: T[],
  params: TAddFlavorParams<T>,
) => {
  const { entities, regionalizedFlavor, flavor, enrichFlavor } = params;
  const base = buildBaseFlavorForTable(entities, regionalizedFlavor, flavor);
  if (!base) return acc;

  const pricings = regionalizedFlavor.osTypes.flatMap((osType) => {
    const flavorPriceId = getRegionalizedFlavorOsTypePriceId(
      flavor.name,
      regionalizedFlavor.regionId,
      osType,
    );
    const pricing = entities.flavorPrices.byId.get(flavorPriceId);
    return pricing ? [pricing] : [];
  });

  const {
    realMinimumHourlyPrice,
    realMinimumMonthlyPrice,
    estimatedMinimumMonthlyPrice,
  } = getMinimumPrices(pricings);

  const enrichedBase = {
    ...base,
    realMinimumHourlyPrice,
    realMinimumMonthlyPrice,
    estimatedMinimumMonthlyPrice,
  };

  acc.push(enrichFlavor(enrichedBase, flavor));

  return acc;
};

const buildUnavailableBaseFlavorForTable = (
  flavor: TFlavor,
  entities: TInstancesCatalog['entities'],
): TBaseFlavorDataForTable => {
  const hasNoAvailableRegions = !flavor.regionalizedFlavorIds.some(
    (regionalizedFlavorId) => {
      const regionalizedFlavor = entities.regionalizedFlavors.byId.get(
        regionalizedFlavorId,
      );
      return regionalizedFlavor?.hasStock && regionalizedFlavor.quota;
    },
  );

  return {
    id: flavor.name,
    unavailable: true,
    unavailableQuota: false,
    hasNoAvailableRegions,
    name: flavor.name,
    memory: flavor.specifications.ram.value,
    vCore: flavor.specifications.cpu.value,
    disks: mapDisksToViewModel(flavor.specifications.disks),
    mode: null,
    realMinimumHourlyPrice: null,
    realMinimumMonthlyPrice: null,
    estimatedMinimumMonthlyPrice: null,
  };
};

const addUnavailableFlavor = <T extends TBaseFlavorDataForTable>(
  acc: T[],
  flavor: TFlavor,
  enrichFlavor: TFlavorEnricher<T>,
  entities: TInstancesCatalog['entities'],
) => {
  const alreadyExists = acc.some((f) => f.name === flavor.name);
  if (alreadyExists) return acc;

  const base = buildUnavailableBaseFlavorForTable(flavor, entities);
  acc.push(enrichFlavor(base, flavor));

  return acc;
};
