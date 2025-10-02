import { union } from 'lodash';
import {
  TContinent,
  TContinentID,
  TDeployment,
  TDeploymentModeID,
  TInstancesCatalog,
  TRegion,
} from '@/domain/entities/instancesCatalog';
import {
  TContinentRegionsDTO,
  TDeploymentModeDTO,
  TInstancesCatalogDTO,
  TRegionDTO,
} from './dto.type';
import { iscountryISOCode } from '@/components/flag/country-iso-code';

type TNormalizedEntity<ID, Entity> = {
  byId: Map<ID, Entity>;
  allIds: ID[];
};

const mapCountry = (country: string | null) =>
  country && iscountryISOCode(country) ? country : null;

const mapRegionDTOtoEntity = (regionDto: TRegionDTO): TRegion => ({
  name: regionDto.datacenter,
  deploymentMode: regionDto.type,
  continentIds: regionDto.filters.region,
  country: mapCountry(regionDto.country),
  availabilityZones: regionDto.availabilityZones,
  isActivable: regionDto.isActivable,
  isActivated: regionDto.isActivated,
  isInMaintenance: regionDto.isInMaintenance,
  microRegions: [regionDto.name],
});

const mapDeploymentModeDTOToEntity = (
  mode: TDeploymentModeDTO,
): TDeployment => ({ name: mode.name, tags: mode.tags ?? [] });

const normalizeData = <DTOItem extends { name: ItemID }, ItemID, EntityItem>(
  items: DTOItem[],
  mapper: (arg: DTOItem) => EntityItem,
) =>
  items.reduce<TNormalizedEntity<ItemID, EntityItem>>(
    (acc, currentItem) => {
      if (!acc.allIds.includes(currentItem.name))
        acc.allIds.push(currentItem.name);
      acc.byId.set(currentItem.name, mapper(currentItem));
      return acc;
    },
    { byId: new Map(), allIds: [] },
  );

const normalizeRegion = (
  regions: TRegionDTO[],
  mapper: (arg: TRegionDTO) => TRegion,
) =>
  regions.reduce<TNormalizedEntity<string, TRegion>>(
    (acc, region) => {
      if (!acc.allIds.includes(region.datacenter))
        acc.allIds.push(region.datacenter);
      const existingRegion = acc.byId.get(region.datacenter);
      if (existingRegion) {
        acc.byId.set(region.datacenter, {
          ...existingRegion,
          microRegions: [...existingRegion.microRegions, region.name],
        });
      } else {
        acc.byId.set(region.datacenter, mapper(region));
      }
      return acc;
    },
    { byId: new Map(), allIds: [] },
  );

const mapContinentDTOToEntity = (
  continentRegion: TContinentRegionsDTO,
  regionsDTO: TRegionDTO[],
): TContinent => {
  const regionsDatacenters = continentRegion.regions.reduce<string[]>(
    (acc, regionID) => {
      const foundRegion = regionsDTO.find(
        (regionDTO) => regionDTO.name === regionID,
      );
      if (!foundRegion) return acc;
      if (!acc.includes(foundRegion.datacenter))
        acc.push(foundRegion.datacenter);
      return acc;
    },
    [],
  );

  return {
    name: continentRegion.name,
    datacenterIds: regionsDatacenters,
    tags: continentRegion.tags,
  };
};

const normalizeContinent = (
  continentRegions: TContinentRegionsDTO[],
  regionsDTO: TRegionDTO[],
) =>
  continentRegions.reduce(
    (acc, continentRegion) => {
      if (!acc.allIds.includes(continentRegion.name))
        acc.allIds.push(continentRegion.name);
      const continent = mapContinentDTOToEntity(continentRegion, regionsDTO);

      acc.byId.set(continentRegion.name, continent);

      return acc;
    },
    { byId: new Map(), allIds: [] } as TNormalizedEntity<string, TContinent>,
  );

const getContinentIdsByDeploymentModeId = (regions: TRegionDTO[]) =>
  regions.reduce((acc, currentRegion) => {
    if (!currentRegion.filters.region.length) return acc;

    const continents = acc.get(currentRegion.type);
    acc.set(
      currentRegion.type,
      continents
        ? union(continents, currentRegion.filters.region)
        : currentRegion.filters.region,
    );

    return acc;
  }, new Map<TDeploymentModeID, TContinentID[]>());

export const mapInstancesCatalogDtoToEntity = (
  catalogDTO: TInstancesCatalogDTO,
): TInstancesCatalog => {
  const catalog: TInstancesCatalog = {
    entities: {
      regions: normalizeRegion(catalogDTO.regions, mapRegionDTOtoEntity),
      deploymentModes: normalizeData(
        catalogDTO.filters.deployments,
        mapDeploymentModeDTOToEntity,
      ),
      continents: normalizeContinent(
        catalogDTO.filters.regions,
        catalogDTO.regions,
      ),
    },
    relations: {
      continentIdsByDeploymentModeId: getContinentIdsByDeploymentModeId(
        catalogDTO.regions,
      ),
    },
  };

  return catalog;
};
