import { TCatalogDto, TModelDto, TRegionDto } from '@/types/catalog/api.types';
import {
  TRegionEntity,
  TRegionAvailability,
  TRegionsData,
  TRegionCategory,
  TRegion,
} from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';

export type TRegionSelector = (
  rawData: TCatalogDto,
  selectedModel: string | null,
) => TRegionEntity | undefined;

const getAvailableRegionsByModel = (
  rawModels: DeepReadonly<TModelDto[]>,
  selectedModel: string | null,
): string[] => {
  const foundPricingsByModel = rawModels.find(
    (model) => model.name === selectedModel,
  )?.pricings;

  if (!foundPricingsByModel || !selectedModel) return [];
  return [
    ...foundPricingsByModel.reduce((acc, cur) => {
      cur.regions.forEach(acc.add.bind(acc));
      return acc;
    }, new Set<string>()),
  ];
};

const getRegionsByAvailability = (
  rawData: TCatalogDto,
  selectedModel: string,
  availability: TRegionAvailability,
): TRegion[] => {
  const modelAvailableRegions = getAvailableRegionsByModel(
    rawData.models,
    selectedModel,
  );

  const filterPredicate = (rawRegion: TRegionDto): boolean =>
    modelAvailableRegions.some((elt) => elt === rawRegion.name);

  return availability === 'available'
    ? rawData.regions.filter(filterPredicate)
    : rawData.regions.filter((elt) => !filterPredicate(elt));
};

const getAvailableMicroRegions = (
  rawData: TCatalogDto,
  selectedModel: string,
): TRegion[] => {
  const allAvailableRegions = getRegionsByAvailability(
    rawData,
    selectedModel,
    'available',
  );

  const lookup = allAvailableRegions.reduce((acc, cur) => {
    acc.set(cur.datacenter, (acc.get(cur.datacenter) ?? 0) + 1);
    return acc;
  }, new Map());

  return allAvailableRegions.filter(
    (region) => lookup.get(region.datacenter) > 1,
  );
};

const getAvailableMacroRegions = (
  rawData: TCatalogDto,
  selectedModel: string,
): TRegion[] => {
  const allAvailableRegions = getRegionsByAvailability(
    rawData,
    selectedModel,
    'available',
  );

  return allAvailableRegions.reduce((acc, cur) => {
    if (!acc.length) return [cur];
    const foundDatacenter = acc.find(
      (elt) => elt.datacenter === cur.datacenter,
    );
    if (!foundDatacenter) return [...acc, cur];
    return acc;
  }, [] as TRegion[]);
};

const mapRegionsData = (
  rawData: TCatalogDto,
  selectedModel: string,
): TRegionsData => {
  const allAvailableRegions = getRegionsByAvailability(
    rawData,
    selectedModel,
    'available',
  );
  const availableMacroRegions = getAvailableMacroRegions(
    rawData,
    selectedModel,
  );
  const availableMicroRegions = getAvailableMicroRegions(
    rawData,
    selectedModel,
  );
  const unavailableRegions = getRegionsByAvailability(
    rawData,
    selectedModel,
    'unavailable',
  );

  return {
    allAvailableRegions,
    availableMacroRegions,
    availableMicroRegions,
    unavailableRegions,
  };
};

const getRegionCategories = (rawData: TCatalogDto): TRegionCategory[] => {
  const allRegionCategory: TRegionCategory = {
    name: 'all',
    isNew: false,
  };

  return [allRegionCategory, ...rawData.regionCategories];
};

export const regionSelector: TRegionSelector = (rawData, selectedModel) => {
  if (
    !selectedModel ||
    !rawData.regionCategories.length ||
    !rawData.regions.length
  )
    return undefined;

  return {
    regions: {
      categories: getRegionCategories(rawData),
      data: mapRegionsData(rawData, selectedModel),
    },
  };
};
