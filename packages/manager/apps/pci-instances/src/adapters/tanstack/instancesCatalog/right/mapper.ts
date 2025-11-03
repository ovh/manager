/* eslint-disable max-lines */
import { union } from 'lodash';
import {
  TContinent,
  TContinentID,
  TDeployment,
  TDeploymentModeID,
  TInstancesCatalog,
  TMicroRegion,
  TMacroRegion,
  TFlavorCategory,
  TFlavorType,
  TFlavor,
  TRegionalizedFlavor,
  TFlavorPrices,
  TPrice,
} from '@/domain/entities/instancesCatalog';
import {
  TContinentRegionsDTO,
  TDeploymentModeDTO,
  TFlavorCategoryDTO,
  TFlavorDTO,
  TFlavorRegionDTO,
  TFlavorSubCategoryDTO,
  TInstancesCatalogDTO,
  TPriceDTO,
  TPricingDTO,
  TRegionDTO,
  TSpecDetailsDTO,
  TSpecificationsDTO,
} from './dto.type';
import { iscountryISOCode } from '@/components/flag/country-iso-code';

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

const mapRegionDTOtoMicroRegionEntity = (
  regionDto: TRegionDTO,
): TMicroRegion => ({
  name: regionDto.name,
  availabilityZones: regionDto.availabilityZones,
  isActivable: regionDto.isActivable,
  isInMaintenance: regionDto.isInMaintenance,
  macroRegionId: regionDto.datacenter,
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
  macroRegions: TNormalizedEntity<string, TMacroRegion>;
  microRegions: TNormalizedEntity<string, TMicroRegion>;
};

type TNormalizeRegionMappers = {
  macroRegionMapper: (arg: TRegionDTO) => TMacroRegion;
  microRegionMapper: (arg: TRegionDTO) => TMicroRegion;
};

const normalizeRegion = (mappers: TNormalizeRegionMappers) => (
  regions: TRegionDTO[],
) =>
  regions.reduce<TRegions>(
    (acc, region) => {
      if (!acc.macroRegions.allIds.includes(region.datacenter))
        acc.macroRegions.allIds.push(region.datacenter);

      if (!acc.microRegions.allIds.includes(region.name))
        acc.microRegions.allIds.push(region.name);

      const existingRegion = acc.macroRegions.byId.get(region.datacenter);

      if (existingRegion) {
        acc.macroRegions.byId.set(region.datacenter, {
          ...existingRegion,
          microRegions: [...existingRegion.microRegions, region.name],
        });
      } else {
        acc.macroRegions.byId.set(
          region.datacenter,
          mappers.macroRegionMapper(region),
        );
      }

      acc.microRegions.byId.set(region.name, mappers.microRegionMapper(region));

      return acc;
    },
    {
      macroRegions: { byId: new Map(), allIds: [] },
      microRegions: { byId: new Map(), allIds: [] },
    },
  );

type TFlavorCategories = {
  flavorCategories: TNormalizedEntity<string, TFlavorCategory>;
  flavorTypes: TNormalizedEntity<string, TFlavorType>;
};

type TNormalizeCategoryMappers = {
  flavorCategoryMapper: (arg: TFlavorCategoryDTO) => TFlavorCategory;
  flavorTypeMapper: (arg: TFlavorType) => TFlavorType;
};

const mapCategoryDTOToFlavorCategoryEntity = (
  category: TFlavorCategoryDTO,
): TFlavorCategory => ({
  name: category.name,
  types: category.subCategories.map((subC) => subC.name),
  tags: category.tags,
});

const mapSubCategoryDTOToFlavorTypeEntity = (
  subCategory: TFlavorSubCategoryDTO,
): TFlavorType => ({
  name: subCategory.name,
  flavors: subCategory.flavors,
  tags: subCategory.tags,
});

const normalizeFlavorCategories = (mappers: TNormalizeCategoryMappers) => (
  categories: TFlavorCategoryDTO[],
) =>
  categories.reduce<TFlavorCategories>(
    (acc, category) => {
      if (!acc.flavorCategories.allIds.includes(category.name))
        acc.flavorCategories.allIds.push(category.name);

      acc.flavorCategories.byId.set(
        category.name,
        mappers.flavorCategoryMapper(category),
      );

      const { byId: typeById, allIds: typeAllIds } = normalizeData(
        category.subCategories,
        mappers.flavorTypeMapper,
      );

      acc.flavorTypes = {
        byId: new Map([...acc.flavorTypes.byId, ...typeById]),
        allIds: Array.from(new Set([...acc.flavorTypes.allIds, ...typeAllIds])),
      };

      return acc;
    },
    {
      flavorCategories: { byId: new Map(), allIds: [] },
      flavorTypes: { byId: new Map(), allIds: [] },
    },
  );

const mapSpecificationsDetails = (specs: TSpecDetailsDTO) => ({
  unit: specs.unit,
  value: specs.value,
});

const mapFlavorSpecifications = (specs: TSpecificationsDTO) => ({
  cpu: mapSpecificationsDetails(specs.cpu),
  ram: mapSpecificationsDetails(specs.ram),
  storage: mapSpecificationsDetails(specs.storage),
  bandwidth: {
    public: mapSpecificationsDetails(specs.bandwidth.public),
    private: mapSpecificationsDetails(specs.bandwidth.private),
  },
});

type TNormalizeFlavorMappers = {
  flavorMapper: (flavorDTO: TFlavorDTO) => TFlavor;
  regionalizedFlavorMapper: (
    flavorRegionDTO: TFlavorRegionDTO,
    flavorName: string,
    pricings: TPricingDTO[],
  ) => TRegionalizedFlavor[];
  flavorPricesMapper: (
    flavorPricingDTO: TPricingDTO,
    priceId: string,
  ) => TFlavorPrices;
};

const getFlavorPriceId = (flavorNameWithPricingIndex: string) =>
  `${flavorNameWithPricingIndex}-price`;

const mapFlavorDTOToFlavorEntity = (flavorDTO: TFlavorDTO): TFlavor => ({
  name: flavorDTO.name,
  specifications: mapFlavorSpecifications(flavorDTO.specifications),
  osType: flavorDTO.osType,
  regionalizedFlavorIds: flavorDTO.regions.map((region) => region.flavorId),
});

const mapFlavorDTOToRegionalizedFlavorEntity = (
  flavorRegionDTO: TFlavorRegionDTO,
  flavorName: string,
  pricings: TPricingDTO[],
): TRegionalizedFlavor[] =>
  pricings.flatMap((pricing, index) =>
    pricing.regions.includes(flavorRegionDTO.name)
      ? [
          {
            id: flavorRegionDTO.flavorId,
            flavorId: flavorName,
            regionID: flavorRegionDTO.name,
            quota: flavorRegionDTO.quota,
            availableStocks: flavorRegionDTO.availableStocks,
            tags: flavorRegionDTO.tags,
            priceId: getFlavorPriceId(`${flavorName}-${index}`),
          },
        ]
      : [],
  );

const mapFlavorPricesDTOToFlavorPricesEntity = (
  priceDTO: TPriceDTO,
): TPrice => ({
  type: priceDTO.type,
  currencyCode: priceDTO.price.currencyCode,
  includeVat: priceDTO.includeVat,
  value: priceDTO.price.value,
  priceInUcents: priceDTO.price.priceInUcents,
  text: priceDTO.price.text,
});

const mapFlavorPricingDTOToFlavorPricesEntity = (
  flavorPricingDTO: TPricingDTO,
  priceId: string,
): TFlavorPrices => ({
  id: priceId,
  prices: flavorPricingDTO.prices.map(mapFlavorPricesDTOToFlavorPricesEntity),
});

type TFlavors = {
  flavors: TNormalizedEntity<string, TFlavor>;
  regionalizedFlavors: TNormalizedEntity<string, TRegionalizedFlavor>;
  flavorPrices: TNormalizedEntity<string, TFlavorPrices>;
};

const setFlavors = (
  acc: TFlavors,
  flavorDTO: TFlavorDTO,
  flavorMapper: (flavorDTO: TFlavorDTO) => TFlavor,
) => {
  if (!acc.flavors.allIds.includes(flavorDTO.name))
    acc.flavors.allIds.push(flavorDTO.name);
  acc.flavors.byId.set(flavorDTO.name, flavorMapper(flavorDTO));
};
const setRegionalizedFlavors = (
  acc: TFlavors,
  flavorDTO: TFlavorDTO,
  regionalizedFlavorMapper: (
    flavorRegionDTO: TFlavorRegionDTO,
    flavorName: string,
    pricings: TPricingDTO[],
  ) => TRegionalizedFlavor[],
) =>
  flavorDTO.regions.map((regionFlavorDTO) => {
    if (!acc.regionalizedFlavors.allIds.includes(regionFlavorDTO.flavorId))
      acc.regionalizedFlavors.allIds.push(regionFlavorDTO.flavorId);
    const mappedRegionalizedFlavor = regionalizedFlavorMapper(
      regionFlavorDTO,
      flavorDTO.name,
      flavorDTO.pricings,
    )[0];
    if (mappedRegionalizedFlavor) {
      acc.regionalizedFlavors.byId.set(
        regionFlavorDTO.flavorId,
        mappedRegionalizedFlavor,
      );
    }
  });

const setFlavorPrices = (
  acc: TFlavors,
  flavorDTO: TFlavorDTO,
  flavorPricesMapper: (
    flavorPricingDTO: TPricingDTO,
    priceId: string,
  ) => TFlavorPrices,
) => {
  flavorDTO.pricings.forEach((flavorPricingDTO, index) => {
    const priceId = getFlavorPriceId(`${flavorDTO.name}-${index}`);
    if (!acc.flavorPrices.allIds.includes(priceId))
      acc.flavorPrices.allIds.push(priceId);
    acc.flavorPrices.byId.set(
      priceId,
      flavorPricesMapper(flavorPricingDTO, priceId),
    );
  });
};

const normalizeFlavor = ({
  flavorMapper,
  regionalizedFlavorMapper,
  flavorPricesMapper,
}: TNormalizeFlavorMappers) => (flavorsDTO: TFlavorDTO[]) =>
  flavorsDTO.reduce<TFlavors>(
    (acc, flavorDTO) => {
      setFlavors(acc, flavorDTO, flavorMapper);
      setRegionalizedFlavors(acc, flavorDTO, regionalizedFlavorMapper);
      setFlavorPrices(acc, flavorDTO, flavorPricesMapper);
      return acc;
    },
    {
      flavors: { byId: new Map(), allIds: [] },
      regionalizedFlavors: { byId: new Map(), allIds: [] },
      flavorPrices: { byId: new Map(), allIds: [] },
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
  }, new Map<TDeploymentModeID, TContinentID[]>());

export const mapInstancesCatalogDtoToEntity = (
  catalogDTO: TInstancesCatalogDTO,
): TInstancesCatalog => {
  const catalog: TInstancesCatalog = {
    entities: {
      ...normalizeRegion({
        macroRegionMapper: mapRegionDTOtoRegionEntity,
        microRegionMapper: mapRegionDTOtoMicroRegionEntity,
      })(catalogDTO.regions),
      deploymentModes: normalizeData(
        catalogDTO.filters.deployments,
        mapDeploymentModeDTOToEntity,
      ),
      continents: normalizeContinent(
        catalogDTO.filters.regions,
        catalogDTO.regions,
      ),
      ...normalizeFlavorCategories({
        flavorCategoryMapper: mapCategoryDTOToFlavorCategoryEntity,
        flavorTypeMapper: mapSubCategoryDTOToFlavorTypeEntity,
      })(catalogDTO.filters.categories),
      ...normalizeFlavor({
        flavorMapper: mapFlavorDTOToFlavorEntity,
        regionalizedFlavorMapper: mapFlavorDTOToRegionalizedFlavorEntity,
        flavorPricesMapper: mapFlavorPricingDTOToFlavorPricesEntity,
      })(catalogDTO.flavors),
    },
    relations: {
      continentIdsByDeploymentModeId: getContinentIdsByDeploymentModeId(
        catalogDTO.regions,
      ),
    },
  };

  return catalog;
};
