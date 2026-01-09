import { union } from 'lodash';
import type {
  TCity,
  TContinent,
  TContinentId,
  TDataCenter,
  TDeployment,
  TDeploymentModeId,
  TShareCatalog,
} from '@/domain/entities/catalog.entity';
import type { TContinentRegionsDTO, TDeploymentModeDTO, TRegionDTO, TShareCatalogDTO } from './dto.type';
import { iscountryISOCode } from '@/components/new-lib/flag/country-iso-code';

type TNormalizedEntity<ID, Entity> = {
  byId: Map<ID, Entity>;
  allIds: ID[];
};

const mapCountry = (country: string | null) =>
  country && iscountryISOCode(country) ? country : null;

const mapRegionDTOtoRegionEntity = (regionDto: TRegionDTO): TCity => ({
  name: regionDto.datacenter,
  deploymentMode: regionDto.type,
  continentIds: regionDto.filters.region,
  country: mapCountry(regionDto.country),
  dataCenters: [regionDto.name],
});

const mapRegionDTOtoMicroRegionEntity = (
  regionDto: TRegionDTO,
): TDataCenter => ({
  name: regionDto.name,
  availabilityZones: regionDto.availabilityZones,
  isActivable: regionDto.isActivable,
  isInMaintenance: regionDto.isInMaintenance,
  cityId: regionDto.datacenter,
});

const mapDeploymentModeDTOToEntity = (
  mode: TDeploymentModeDTO,
): TDeployment => ({ name: mode.name, tags: mode.tags });

const normalizeData = <
  ItemID extends string,
  DTOItem extends { name: ItemID },
  EntityItem
>(
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

type TRegions = {
  cities: TNormalizedEntity<string, TCity>;
  dataCenters: TNormalizedEntity<string, TDataCenter>;
};

type TNormalizeRegionMappers = {
  cityMapper: (arg: TRegionDTO) => TCity;
  dataCenterMapper: (arg: TRegionDTO) => TDataCenter;
};

const normalizeRegions = (mappers: TNormalizeRegionMappers) => (
  regions: TRegionDTO[],
) =>
  regions.reduce<TRegions>(
    (acc, region) => {
      if (!acc.cities.allIds.includes(region.datacenter))
        acc.cities.allIds.push(region.datacenter);

      if (!acc.dataCenters.allIds.includes(region.name))
        acc.dataCenters.allIds.push(region.name);

      const existingRegion = acc.cities.byId.get(region.datacenter);

      if (existingRegion) {
        acc.cities.byId.set(region.datacenter, {
          ...existingRegion,
          dataCenters: [...existingRegion.dataCenters, region.name],
        });
      } else {
        acc.cities.byId.set(
          region.datacenter,
          mappers.cityMapper(region),
        );
      }

      acc.dataCenters.byId.set(region.name, mappers.dataCenterMapper(region));

      return acc;
    },
    {
      cities: { byId: new Map(), allIds: [] },
      dataCenters: { byId: new Map(), allIds: [] },
    },
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
  continentRegions.reduce<TNormalizedEntity<string, TContinent>>(
    (acc, continentRegion) => {
      debugger;
      if (!acc.allIds.includes(continentRegion.name))
        acc.allIds.push(continentRegion.name);
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
        ? union(continents, currentRegion.filters.region)
        : currentRegion.filters.region,
    );

    return acc;
  }, new Map<TDeploymentModeId, TContinentId[]>());
export const mapCatalogDTOToCatalog = (
  catalogDto: TShareCatalogDTO,
): TShareCatalog =>{
  debugger;
  console.log('mapCatalogDTOToCatalog', normalizeContinent(
    catalogDto.filters.region,
    catalogDto.regions,
  ));
  // console.log('map', { catalogDto });
  return ({
    entities: {
      ...normalizeRegions({
        cityMapper: mapRegionDTOtoRegionEntity,
        dataCenterMapper: mapRegionDTOtoMicroRegionEntity,
      })(catalogDto.regions),
      deploymentModes: normalizeData(
        catalogDto.filters.deployment,
        mapDeploymentModeDTOToEntity,
      ),
      continents: { allIds: [], byId: new Map<TContinentId, TContinent>()}
      // continents: normalizeContinent(
      //   catalogDto.filters.region,
      //   catalogDto.regions,
      // ),
    },
  });
};
