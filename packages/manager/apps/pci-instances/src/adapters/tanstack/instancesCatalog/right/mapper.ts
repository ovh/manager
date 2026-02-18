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
  TRegionalizedFlavorOsType,
  TImage,
  TRegionalizedImage,
  TImageType,
  TImageTypeID,
  TDisk,
} from '@/domain/entities/instancesCatalog';
import {
  TContinentRegionsDTO,
  TDeploymentModeDTO,
  TFlavorCategoryDTO,
  TFlavorDTO,
  TFlavorRegionDTO,
  TFlavorSubCategoryDTO,
  TImageDTO,
  TInstancesCatalogDTO,
  TPriceDTO,
  TPricingDTO,
  TRegionDTO,
  TSpecDetailsDTO,
  TSpecificationsDTO,
  TDiskDTO,
} from './dto.type';
import { iscountryISOCode } from '@/components/flag/country-iso-code';
import {
  getRegionalizedFlavorId,
  getRegionalizedFlavorOsTypeId,
  getRegionalizedFlavorOsTypePriceId,
  getRegionalizedImageId,
} from '@/utils';

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
  isActivated: regionDto.isActivated,
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

const mapDiskDTOToDiskEntity = (disk: TDiskDTO): TDisk => ({
  capacity: mapSpecificationsDetails(disk.capacity),
  number: disk.number,
  ...(disk.interface !== undefined && { interface: disk.interface }),
});

const mapFlavorSpecifications = (specs: TSpecificationsDTO) => {
  const base = {
    cpu: mapSpecificationsDetails(specs.cpu),
    ram: mapSpecificationsDetails(specs.ram),
    bandwidth: {
      public: mapSpecificationsDetails(specs.bandwidth.public),
      private: mapSpecificationsDetails(specs.bandwidth.private),
    },
    disks: specs.disks.map(mapDiskDTOToDiskEntity),
  };

  return specs.gpu
    ? {
        ...base,
        gpu: {
          memory: {
            size: mapSpecificationsDetails(specs.gpu.memory.size),
            interface: specs.gpu.memory.interface,
          },
          model: mapSpecificationsDetails(specs.gpu.model),
        },
      }
    : base;
};

type TNormalizeFlavorMappers = {
  flavorMapper: (flavorDTO: TFlavorDTO) => TFlavor;
  regionalizedFlavorMapper: (
    flavorRegionDTO: TFlavorRegionDTO,
    flavorName: string,
    regionalizedFlavorsById: Map<string, TRegionalizedFlavor>,
  ) => TRegionalizedFlavor;
  regionalizedFlavorOsTypeMapper: (
    regionalizedFlavorOsTypeName: string,
    regionFlavorDTO: TFlavorRegionDTO,
    pricings: TPricingDTO[],
  ) => TRegionalizedFlavorOsType;
  flavorPricesMapper: (
    flavorPricingDTO: TPricingDTO,
    priceId: string,
  ) => TFlavorPrices;
};

const mapFlavorDTOToFlavorEntity = (flavorDTO: TFlavorDTO): TFlavor => ({
  name: flavorDTO.name,
  specifications: mapFlavorSpecifications(flavorDTO.specifications),
  regionalizedFlavorIds: Array.from(
    new Set(
      flavorDTO.regions.map((region) =>
        getRegionalizedFlavorId(flavorDTO.name, region.name),
      ),
    ),
  ),
});

const mapFlavorDTOToRegionalizedFlavorEntity = (
  regionalizedFlavor: TFlavorRegionDTO,
  regionalizedFlavorName: string,
  regionalizedFlavorsById: Map<string, TRegionalizedFlavor>,
): TRegionalizedFlavor => {
  const regionalizedFlavorId = getRegionalizedFlavorId(
    regionalizedFlavorName,
    regionalizedFlavor.name,
  );

  const regionalizedFlavorFound = regionalizedFlavorsById.get(
    regionalizedFlavorId,
  );

  if (!regionalizedFlavorFound) {
    const regionalizedFlavorToAdd = {
      id: regionalizedFlavorId,
      hasStock: regionalizedFlavor.availableStocks,
      regionId: regionalizedFlavor.name,
      flavorId: regionalizedFlavorName,
      quota: regionalizedFlavor.quota,
      osTypes: [regionalizedFlavor.osType],
      tags: regionalizedFlavor.tags,
    };
    return regionalizedFlavorToAdd;
  } else {
    const updatedRegionalizedRegion = {
      ...regionalizedFlavorFound,
      hasStock:
        regionalizedFlavorFound.hasStock || regionalizedFlavor.availableStocks,
      quota: regionalizedFlavorFound.quota || regionalizedFlavor.quota,
      osTypes: [...regionalizedFlavorFound.osTypes, regionalizedFlavor.osType],
    };
    return updatedRegionalizedRegion;
  }
};

const mapFlavorDTOToRegionalizedFlavorOsTypeEntity = (
  regionalizedFlavorOsTypeName: string,
  regionFlavorDTO: TFlavorRegionDTO,
): TRegionalizedFlavorOsType => ({
  id: regionalizedFlavorOsTypeName,
  flavorId: regionFlavorDTO.flavorId,
  osType: regionFlavorDTO.osType,
  quota: regionFlavorDTO.quota,
  hasStock: regionFlavorDTO.availableStocks,
});

const mapFlavorPricesDTOToFlavorPricesEntity = (
  priceDTO: TPriceDTO,
): TPrice => ({
  type: priceDTO.type,
  price: {
    currencyCode: priceDTO.price.currencyCode,
    value: priceDTO.price.value,
    priceInUcents: priceDTO.price.priceInUcents,
    text: priceDTO.price.text,
  },
  monthlyEquivalent: priceDTO.monthlyEquivalent,
  includeVat: priceDTO.includeVat,
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
  regionalizedFlavorOsTypes: TNormalizedEntity<
    string,
    TRegionalizedFlavorOsType
  >;
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
    regionalizedFlavorId: string,
    regionalizedFlavorsById: Map<string, TRegionalizedFlavor>,
  ) => TRegionalizedFlavor,
) =>
  flavorDTO.regions.forEach((regionFlavorDTO) => {
    const regionalizedFlavorId = getRegionalizedFlavorId(
      flavorDTO.name,
      regionFlavorDTO.name,
    );

    if (!acc.regionalizedFlavors.allIds.includes(regionalizedFlavorId))
      acc.regionalizedFlavors.allIds.push(regionalizedFlavorId);

    acc.regionalizedFlavors.byId.set(
      regionalizedFlavorId,
      regionalizedFlavorMapper(
        regionFlavorDTO,
        flavorDTO.name,
        acc.regionalizedFlavors.byId,
      ),
    );
  });

const setRegionalizedFlavorOsTypes = (
  acc: TFlavors,
  flavorDTO: TFlavorDTO,
  regionalizedFlavorOsTypeMapper: (
    regionalizedFlavorOsTypeName: string,
    flavorRegionDTO: TFlavorRegionDTO,
    pricings: TPricingDTO[],
  ) => TRegionalizedFlavorOsType,
) =>
  flavorDTO.regions.forEach((flavorRegionDTO) => {
    const regionalizedFlavorOsTypeId = getRegionalizedFlavorOsTypeId(
      flavorDTO.name,
      flavorRegionDTO.name,
      flavorRegionDTO.osType,
    );

    if (
      !acc.regionalizedFlavorOsTypes.allIds.includes(regionalizedFlavorOsTypeId)
    )
      acc.regionalizedFlavorOsTypes.allIds.push(regionalizedFlavorOsTypeId);
    acc.regionalizedFlavorOsTypes.byId.set(
      regionalizedFlavorOsTypeId,
      regionalizedFlavorOsTypeMapper(
        regionalizedFlavorOsTypeId,
        flavorRegionDTO,
        flavorDTO.pricings,
      ),
    );
  });

const setFlavorPrices = (
  acc: TFlavors,
  flavorDTO: TFlavorDTO,
  flavorPricesMapper: (
    flavorPricingDTO: TPricingDTO,
    priceId: string,
  ) => TFlavorPrices,
) =>
  flavorDTO.pricings.forEach((flavorPricingDTO) => {
    flavorPricingDTO.regions.forEach((region) => {
      const regionalizedFlavorOsTypePriceId = getRegionalizedFlavorOsTypePriceId(
        flavorDTO.name,
        region,
        flavorPricingDTO.osType,
      );

      if (!acc.flavorPrices.allIds.includes(regionalizedFlavorOsTypePriceId))
        acc.flavorPrices.allIds.push(regionalizedFlavorOsTypePriceId);
      acc.flavorPrices.byId.set(
        regionalizedFlavorOsTypePriceId,
        flavorPricesMapper(flavorPricingDTO, regionalizedFlavorOsTypePriceId),
      );
    });
  });

const normalizeFlavor = ({
  flavorMapper,
  regionalizedFlavorMapper,
  regionalizedFlavorOsTypeMapper,
  flavorPricesMapper,
}: TNormalizeFlavorMappers) => (flavorsDTO: TFlavorDTO[]) =>
  flavorsDTO.reduce<TFlavors>(
    (acc, flavorDTO) => {
      setFlavors(acc, flavorDTO, flavorMapper);
      setRegionalizedFlavors(acc, flavorDTO, regionalizedFlavorMapper);
      setRegionalizedFlavorOsTypes(
        acc,
        flavorDTO,
        regionalizedFlavorOsTypeMapper,
      );
      setFlavorPrices(acc, flavorDTO, flavorPricesMapper);
      return acc;
    },
    {
      flavors: { byId: new Map(), allIds: [] },
      regionalizedFlavors: { byId: new Map(), allIds: [] },
      regionalizedFlavorOsTypes: { byId: new Map(), allIds: [] },
      flavorPrices: { byId: new Map(), allIds: [] },
    },
  );

type TImages = {
  imageTypes: TNormalizedEntity<TImageTypeID, TImageType>;
  images: TNormalizedEntity<string, TImage>;
  regionalizedImages: TNormalizedEntity<string, TRegionalizedImage>;
};

const mapImageTypeDTOToImageEntity = (imageDTO: TImageDTO, acc: TImages) => {
  if (imageDTO.category === 'unknown' || imageDTO.category === 'snapshot')
    return acc;

  const foundImageType = acc.imageTypes.byId.get(imageDTO.category);
  if (!foundImageType)
    acc.imageTypes.byId.set(imageDTO.category, {
      id: imageDTO.category,
      imageIds: [imageDTO.name],
    });

  if (foundImageType && !foundImageType.imageIds.includes(imageDTO.name)) {
    foundImageType.imageIds.push(imageDTO.name);
  }

  const foundImage = acc.images.byId.get(imageDTO.name);
  if (!foundImage)
    acc.images.byId.set(imageDTO.name, {
      id: imageDTO.name,
      osType: imageDTO.osType,
      variant: imageDTO.subCategory,
    });

  imageDTO.regions.forEach((region) => {
    const regionalizedImageId = getRegionalizedImageId(
      imageDTO.name,
      region.name,
    );
    acc.regionalizedImages.allIds.push(regionalizedImageId);
    acc.regionalizedImages.byId.set(regionalizedImageId, {
      id: regionalizedImageId,
      imageId: region.imageId,
    });
  });
};

const normalizeFlavorImage = (imagesDTO: TImageDTO[]) =>
  imagesDTO.reduce<TImages>(
    (acc, imageDTO) => {
      if (imageDTO.category === 'unknown' || imageDTO.category === 'snapshot')
        return acc;

      if (!acc.imageTypes.allIds.includes(imageDTO.category))
        acc.imageTypes.allIds.push(imageDTO.category);

      if (!acc.images.allIds.includes(imageDTO.name))
        acc.images.allIds.push(imageDTO.name);

      mapImageTypeDTOToImageEntity(imageDTO, acc);

      return acc;
    },
    {
      imageTypes: { byId: new Map(), allIds: [] },
      images: { byId: new Map(), allIds: [] },
      regionalizedImages: { byId: new Map(), allIds: [] },
    },
  );

const mapContinentDTOToEntity = (
  continentRegion: TContinentRegionsDTO,
  regionsDTO: TRegionDTO[],
): TContinent => {
  const continentMicroRegionsSet = new Set(continentRegion.regions);

  const datacenterIds = regionsDTO.reduce<string[]>((acc, regionDTO) => {
    if (!continentMicroRegionsSet.has(regionDTO.name)) return acc;

    if (acc.includes(regionDTO.datacenter)) return acc;

    acc.push(regionDTO.datacenter);
    return acc;
  }, []);

  return {
    name: continentRegion.name,
    datacenterIds,
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
        regionalizedFlavorOsTypeMapper: mapFlavorDTOToRegionalizedFlavorOsTypeEntity,
        flavorPricesMapper: mapFlavorPricingDTOToFlavorPricesEntity,
      })(catalogDTO.flavors),
      ...normalizeFlavorImage(catalogDTO.images),
    },
    relations: {
      continentIdsByDeploymentModeId: getContinentIdsByDeploymentModeId(
        catalogDTO.regions,
      ),
    },
  };

  return catalog;
};
