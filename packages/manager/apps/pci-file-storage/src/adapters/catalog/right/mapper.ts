import { iscountryISOCode } from '@/components/new-lib/flag/country-iso-code';
import type {
  TContinent,
  TContinentId,
  TDeployment,
  TDeploymentModeId,
  TMacroRegion,
  TMicroRegion,
  TShareCatalog,
} from '@/domain/entities/catalog.entity';

import type {
  TContinentRegionsDTO,
  TDeploymentModeDTO,
  TRegionDTO,
  TShareCatalogDTO,
} from './dto.type';

type TNormalizedEntity<ID, Entity> = {
  byId: Map<ID, Entity>;
  allIds: ID[];
};

const mapCountry = (country: string | null) =>
  country && iscountryISOCode(country) ? country : null;

const mapRegionDTOtoRegionEntity = (regionDto: TRegionDTO): TMacroRegion => ({
  name: regionDto.datacenter,
  deploymentMode: regionDto.type,
  continentIds: regionDto.filters.region,
  country: mapCountry(regionDto.country),
  microRegions: [regionDto.name],
});

const mapRegionDTOtoMicroRegionEntity = (regionDto: TRegionDTO): TMicroRegion => ({
  name: regionDto.name,
  availabilityZones: regionDto.availabilityZones,
  isActivable: regionDto.isActivable,
  isInMaintenance: regionDto.isInMaintenance,
  macroRegionId: regionDto.datacenter,
});

const mapDeploymentModeDTOToEntity = (mode: TDeploymentModeDTO): TDeployment => ({
  name: mode.name,
  tags: mode.tags,
});

const normalizeData = <ItemID extends string, DTOItem extends { name: ItemID }, EntityItem>(
  items: DTOItem[],
  mapper: (arg: DTOItem) => EntityItem,
) =>
  items.reduce<TNormalizedEntity<ItemID, EntityItem>>(
    (acc, currentItem) => {
      if (!acc.allIds.includes(currentItem.name)) acc.allIds.push(currentItem.name);
      acc.byId.set(currentItem.name, mapper(currentItem));
      return acc;
    },
    { byId: new Map(), allIds: [] },
  );

type TRegions = {
  macroRegions: TNormalizedEntity<string, TMacroRegion>;
  microRegions: TNormalizedEntity<string, TMicroRegion>;
};

type TNormalizeRegionMappers = {
  macroMapper: (arg: TRegionDTO) => TMacroRegion;
  microMapper: (arg: TRegionDTO) => TMicroRegion;
};

const normalizeRegions = (mappers: TNormalizeRegionMappers) => (regions: TRegionDTO[]) =>
  regions.reduce<TRegions>(
    (acc, region) => {
      if (!acc.macroRegions.allIds.includes(region.datacenter))
        acc.macroRegions.allIds.push(region.datacenter);

      if (!acc.microRegions.allIds.includes(region.name)) acc.microRegions.allIds.push(region.name);

      const existingRegion = acc.macroRegions.byId.get(region.datacenter);

      if (existingRegion) {
        acc.macroRegions.byId.set(region.datacenter, {
          ...existingRegion,
          microRegions: [...existingRegion.microRegions, region.name],
        });
      } else {
        acc.macroRegions.byId.set(region.datacenter, mappers.macroMapper(region));
      }

      acc.microRegions.byId.set(region.name, mappers.microMapper(region));

      return acc;
    },
    {
      macroRegions: { byId: new Map(), allIds: [] },
      microRegions: { byId: new Map(), allIds: [] },
    },
  );

const mapContinentDTOToEntity = (
  continentRegion: TContinentRegionsDTO,
  regionsDTO: TRegionDTO[],
): TContinent => {
  const continentMicroRegionsSet = new Set(continentRegion.regions);

  const macroRegionIds = regionsDTO.reduce<string[]>((acc, regionDTO) => {
    if (!continentMicroRegionsSet.has(regionDTO.name)) return acc;

    if (acc.includes(regionDTO.datacenter)) return acc;

    acc.push(regionDTO.datacenter);
    return acc;
  }, []);

  return {
    name: continentRegion.name,
    macroRegionIds,
    tags: continentRegion.tags,
  };
};

const normalizeContinent = (continentRegions: TContinentRegionsDTO[], regionsDTO: TRegionDTO[]) =>
  continentRegions.reduce<TNormalizedEntity<string, TContinent>>(
    (acc, continentRegion) => {
      if (!acc.allIds.includes(continentRegion.name)) acc.allIds.push(continentRegion.name);
      const continent = mapContinentDTOToEntity(continentRegion, regionsDTO);

      acc.byId.set(continentRegion.name, continent);

      return acc;
    },
    { byId: new Map(), allIds: [] },
  );

const getContinentIdsByDeploymentModeId = (regions: TRegionDTO[]) =>
  regions.reduce((acc, currentRegion) => {
    if (!currentRegion.filters.region.length) return acc;

    const continents = acc.get(currentRegion.type);
    acc.set(
      currentRegion.type,
      continents
        ? Array.from(new Set([...continents, ...currentRegion.filters.region]))
        : currentRegion.filters.region,
    );

    return acc;
  }, new Map<TDeploymentModeId, TContinentId[]>());

export const mapCatalogDTOToCatalog = (catalogDto: TShareCatalogDTO): TShareCatalog => {
  return {
    entities: {
      ...normalizeRegions({
        macroMapper: mapRegionDTOtoRegionEntity,
        microMapper: mapRegionDTOtoMicroRegionEntity,
      })(catalogDto.regions),
      deploymentModes: normalizeData(catalogDto.filters.deployments, mapDeploymentModeDTOToEntity),
      continents: normalizeContinent(catalogDto.filters.regions, catalogDto.regions),
    },
    relations: {
      continentIdsByDeploymentModeId: getContinentIdsByDeploymentModeId(catalogDto.regions),
    },
  };
};
