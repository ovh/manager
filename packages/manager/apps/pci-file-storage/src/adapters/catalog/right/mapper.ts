import { iscountryISOCode } from '@/components/new-lib/flag/country-iso-code';
import type {
  TContinent,
  TContinentId,
  TDeployment,
  TDeploymentModeId,
  TMacroRegion,
  TMicroRegion,
  TMicroRegionId,
  TShare,
  TShareBandwidth,
  TShareCapacity,
  TShareCatalog,
  TShareIOPS,
  TShareId,
  TShareSpecVariant,
  TShareSpecVariantId,
  TShareSpecs,
  TShareSpecsId,
} from '@/domain/entities/catalog.entity';

import type {
  TContinentRegionsDTO,
  TDeploymentModeDTO,
  TRegionDTO,
  TShareBandwidthDTO,
  TShareCapacityDTO,
  TShareCatalogDTO,
  TShareDTO,
  TShareIOPSDTO,
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
  isActivated: regionDto.isActivated,
  isInMaintenance: regionDto.isInMaintenance,
  macroRegionId: regionDto.datacenter,
});

const mapDeploymentModeDTOToEntity = (mode: TDeploymentModeDTO): TDeployment => ({
  name: mode.name,
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

const mapShareCapacityDTOToEntity = (capacity: TShareCapacityDTO): TShareCapacity => ({
  min: capacity.min,
  max: capacity.max,
});

const mapShareIOPSDTOToEntity = (iops: TShareIOPSDTO): TShareIOPS => ({
  guaranteed: iops.guaranteed,
  level: iops.level,
  max: iops.max,
  maxUnit: iops.maxUnit,
  unit: iops.unit,
});

const mapShareBandwidthDTOToEntity = (bandwidth: TShareBandwidthDTO): TShareBandwidth => ({
  guaranteed: bandwidth.guaranteed,
  level: bandwidth.level,
  min: bandwidth.min,
  max: bandwidth.max,
  maxUnit: bandwidth.maxUnit,
  unit: bandwidth.unit,
});

type TNormalizedShareSpecs = {
  specs: TNormalizedEntity<TShareSpecsId, TShareSpecs>;
  shareSpecVariantIdByRegion: Map<TShareSpecsId, Map<TMicroRegionId, TShareSpecVariantId>>;
  shareSpecVariants: Map<TShareSpecVariantId, TShareSpecVariant>;
};

const buildVariantId = (specsId: string, regionId: string): TShareSpecVariantId =>
  `${specsId}::${regionId}`;

const normalizeShareSpecs = (shares: TShareDTO[]): TNormalizedShareSpecs => {
  const specs: TNormalizedEntity<TShareSpecsId, TShareSpecs> = {
    byId: new Map(),
    allIds: [],
  };
  const shareSpecVariantIdByRegion = new Map<
    TShareSpecsId,
    Map<TMicroRegionId, TShareSpecVariantId>
  >();
  const shareSpecVariants = new Map<TShareSpecVariantId, TShareSpecVariant>();

  shares.forEach((share) => {
    share.pricings.forEach((pricing) => {
      const specsId = pricing.specs.name;
      const [firstRegion] = pricing.regions;
      if (!firstRegion) return;
      const existing = specs.byId.get(specsId);
      const variantId = buildVariantId(specsId, firstRegion);

      shareSpecVariants.set(variantId, {
        capacity: mapShareCapacityDTOToEntity(pricing.specs.volume.capacity),
        iops: mapShareIOPSDTOToEntity(pricing.specs.volume.iops),
        bandwidth: mapShareBandwidthDTOToEntity(pricing.specs.bandwidth),
        pricing: { price: pricing.price, interval: pricing.interval },
      });

      if (existing) {
        pricing.regions.forEach((region) => {
          if (!existing.microRegionIds.includes(region)) {
            existing.microRegionIds.push(region);
          }
        });
      } else {
        specs.allIds.push(specsId);
        specs.byId.set(specsId, {
          name: specsId,
          microRegionIds: [...new Set(pricing.regions)],
        });
        shareSpecVariantIdByRegion.set(specsId, new Map());
      }

      const regionMap = shareSpecVariantIdByRegion.get(specsId)!;
      pricing.regions.forEach((region) => {
        regionMap.set(region, variantId);
      });
    });
  });

  return { specs, shareSpecVariantIdByRegion, shareSpecVariants };
};

const mapShareDTOToEntity = (share: TShareDTO): TShare => ({
  name: share.name,
  filters: {
    deployment: share.filters.deployment as TDeploymentModeId[],
  },
  specsIds: share.pricings.map((pricing) => pricing.specs.name),
});

export const mapCatalogDTOToCatalog = (catalogDto: TShareCatalogDTO): TShareCatalog => {
  const { specs, shareSpecVariantIdByRegion, shareSpecVariants } = normalizeShareSpecs(
    catalogDto.models,
  );

  return {
    entities: {
      ...normalizeRegions({
        macroMapper: mapRegionDTOtoRegionEntity,
        microMapper: mapRegionDTOtoMicroRegionEntity,
      })(catalogDto.regions),
      deploymentModes: normalizeData(catalogDto.filters.deployments, mapDeploymentModeDTOToEntity),
      continents: normalizeContinent(catalogDto.filters.regions, catalogDto.regions),
      shares: normalizeData<TShareId, TShareDTO, TShare>(catalogDto.models, mapShareDTOToEntity),
      shareSpecs: specs,
    },
    relations: {
      continentIdsByDeploymentModeId: getContinentIdsByDeploymentModeId(catalogDto.regions),
      shareSpecVariantIdByRegion,
      shareSpecVariants,
    },
  };
};
