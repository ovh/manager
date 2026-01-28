import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { TDeploymentMode } from '../../types/instance/common.type';
import { TOsType } from './common.types';

type TTags = string[] | null;

type TMacroRegionName = string;
type TMicroRegionName = string;
export type TMacroRegionID = TMacroRegionName;
export type TMicroRegionID = TMicroRegionName;
export type TDeploymentModeID = TDeploymentMode;

type TContinentName = string;
export type TContinentID = TContinentName;

type TFlavorCategoryName = string;
export type TFlavorCategoryID = TFlavorCategoryName;

type TFlavorTypeName = string;
export type TFlavorTypeID = TFlavorTypeName;

export const IMAGE_TYPES = ['linux', 'apps', 'windows'] as const;
export type TImageTypeName = typeof IMAGE_TYPES[number];

type TFlavorName = string;
export type TFlavorID = TFlavorName;
export type TRegionalizedFlavorID = TFlavorID;
export type TRegionalizedFlavorOsTypeID = TFlavorID;
export type TFlavorPricesID = TRegionalizedFlavorID;

type TImageVariantName = string;
type TImageVersionName = string;
export type TRegionalizedImageVersionID = string;
export type TImageTypeID = TImageTypeName;

export type TImageID = string;
export type TRegionalizedImageID = string;
export type TImageVariantID = TImageVariantName;
export type TImageVersionID = TImageVersionName;

export type TFlavorType = {
  name: TFlavorTypeName;
  flavors: TFlavorID[];
  tags: TTags;
};

export type TFlavorCategory = {
  name: TFlavorCategoryName;
  types: TFlavorTypeID[];
  tags: TTags;
};

export type TContinent = {
  name: TContinentName;
  datacenterIds: string[];
  tags: TTags;
};

export type TMicroRegion = {
  name: TMicroRegionName;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
  macroRegionId: string;
};

export type TMacroRegion = {
  name: TMacroRegionName;
  deploymentMode: TDeploymentModeID;
  continentIds: TContinentID[];
  country: TCountryIsoCode | null;
  microRegions: TMicroRegionID[];
};

export type TDeployment = {
  name: string;
  tags: TTags;
};

type TSpecDetails = {
  unit: string;
  value: number;
};

export type TDisk = {
  capacity: TSpecDetails;
  number: number;
  interface?: string;
};

export type TGpuMemory = {
  interface: string;
  size: TSpecDetails;
};

export type TGpu = {
  memory: TGpuMemory;
  model: TSpecDetails;
};

type TSpecifications = {
  cpu: TSpecDetails;
  ram: TSpecDetails;
  bandwidth: {
    public: TSpecDetails;
    private: TSpecDetails;
  };
  disks: TDisk[];
  gpu?: TGpu;
};

export type TPriceDetails = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export type TPrice = {
  type: 'hour' | 'month' | 'licence' | 'licenceMonth';
  includeVat: boolean;
  price: TPriceDetails;
  monthlyEquivalent: TPriceDetails | null;
};

/**
 *  id: flavor_region_osType_price
 *  Ex: 'B3-8_BHS1.PREPROD_linux_price'
 */
export type TFlavorPrices = {
  id: TFlavorPricesID;
  prices: TPrice[];
};

export type TRegionalizedFlavorOsType = {
  /**
   *  id: flavor_region_osType
   *  Ex: 'B3-8_BHS1.PREPROD_linux'
   */
  id: string;
  flavorId: TFlavorID;
  osType: TOsType;
  quota: number;
  hasStock: boolean;
};

export type TRegionalizedFlavor = {
  /**
   *  id: flavor_region
   *  Ex: 'B3-8_BHS1.PREPROD'
   *
   *  hasStock: If Linux or Windows stock => true
   *  quota: Linux or Windows quota, they are the same
   */
  id: string;
  regionId: TMicroRegionID;
  flavorId: TFlavorID;
  hasStock: boolean;
  quota: number;
  osTypes: TOsType[];
  tags: TTags;
};

export type TFlavor = {
  name: TFlavorName;
  specifications: TSpecifications;
  regionalizedFlavorIds: TRegionalizedFlavorID[];
};

export type TImageType = {
  id: TImageTypeID;
  imageIds: TImageID[];
};

export type TImage = {
  id: TImageID;
  osType: TOsType;
  variant: string;
};

/**
 *  id: imageId_region
 *  Ex: "Baremetal - Ubuntu 22.04_SGP2"
 */
export type TRegionalizedImage = {
  id: TRegionalizedImageID;
  imageId: string;
};

export type TInstancesCatalog = {
  entities: {
    macroRegions: {
      byId: Map<TMacroRegionID, TMacroRegion>;
      allIds: TMacroRegionID[];
    };
    microRegions: {
      byId: Map<TMicroRegionID, TMicroRegion>;
      allIds: TMicroRegionID[];
    };
    deploymentModes: {
      byId: Map<TDeploymentModeID, TDeployment>;
      allIds: TDeploymentModeID[];
    };
    continents: {
      byId: Map<TContinentID, TContinent>;
      allIds: TContinentID[];
    };
    flavorCategories: {
      byId: Map<TFlavorCategoryID, TFlavorCategory>;
      allIds: TFlavorCategoryID[];
    };
    flavorTypes: {
      byId: Map<TFlavorTypeID, TFlavorType>;
      allIds: TFlavorTypeID[];
    };
    flavors: {
      byId: Map<TFlavorID, TFlavor>;
      allIds: TFlavorID[];
    };
    regionalizedFlavors: {
      byId: Map<TRegionalizedFlavorID, TRegionalizedFlavor>;
      allIds: TRegionalizedFlavorID[];
    };
    regionalizedFlavorOsTypes: {
      byId: Map<TRegionalizedFlavorOsTypeID, TRegionalizedFlavorOsType>;
      allIds: TRegionalizedFlavorOsTypeID[];
    };
    flavorPrices: {
      byId: Map<TFlavorPricesID, TFlavorPrices>;
      allIds: TFlavorPricesID[];
    };
    imageTypes: {
      byId: Map<TImageTypeID, TImageType>;
      allIds: TImageTypeID[];
    };
    images: { byId: Map<TImageID, TImage>; allIds: TImageID[] };
    regionalizedImages: {
      byId: Map<TRegionalizedImageID, TRegionalizedImage>;
      allIds: TRegionalizedImageID[];
    };
  };
  relations: {
    continentIdsByDeploymentModeId: Map<TDeploymentModeID, TContinentID[]>;
  };
};
