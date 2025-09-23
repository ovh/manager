import { union } from 'lodash';
import {
  TContinent,
  TContinentID,
  TDeployment,
  TDeploymentModeID,
  TInstancesCatalog,
  TRegion,
} from '@/types/instance/instancesCatalog.type';
import {
  TContinentRegionsDTO,
  TDeploymentModeDTO,
  TInstancesCatalogDTO,
  TRegionDTO,
} from './dto.type';

type TNormalizedEntity<ID, Entity> = {
  byId: Map<ID, Entity>;
  allIds: ID[];
};

const mapRegionDTOtoEntity = (regionDto: TRegionDTO): TRegion => ({
  name: regionDto.name,
  deploymentMode: regionDto.type,
  continentIds: regionDto.filters.region,
  country: regionDto.country,
  datacenter: regionDto.datacenter,
  availabilityZones: regionDto.availabilityZones,
  isActivable: regionDto.isActivable,
  isActivated: regionDto.isActivated,
  isInMaintenance: regionDto.isInMaintenance,
});

const mapDeploymentModeDTOToEntity = (
  mode: TDeploymentModeDTO,
): TDeployment => ({ name: mode.name, tags: mode.tags });

const mapContinentDTOToEntity = (
  continentDTO: TContinentRegionsDTO,
): TContinent => ({
  name: continentDTO.name,
  regionIds: continentDTO.regions,
  tags: continentDTO.tags,
});

function normalizeData<DTOItem extends { name: ItemID }, ItemID, EntityItem>(
  items: DTOItem[],
  mapper: (arg: DTOItem) => EntityItem,
) {
  return items.reduce(
    (acc, currentItem) => {
      acc.allIds.push(currentItem.name);
      acc.byId.set(currentItem.name, mapper(currentItem));
      return acc;
    },
    { byId: new Map(), allIds: [] } as TNormalizedEntity<ItemID, EntityItem>,
  );
}

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
      regions: normalizeData(catalogDTO.regions, mapRegionDTOtoEntity),
      deploymentModes: normalizeData(
        catalogDTO.filters.deployments,
        mapDeploymentModeDTOToEntity,
      ),
      continents: normalizeData(
        catalogDTO.filters.regions,
        mapContinentDTOToEntity,
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
