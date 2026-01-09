export type TRegionDeploymentModeDTO = 'region' | 'localzone' | 'region-3-az';
type TOsTypeDTO = 'baremetal-linux' | 'bsd' | 'linux' | 'windows';

type TImageCategoryDTO = 'apps' | 'linux' | 'windows' | 'unknown' | 'snapshot';
type TImageOsType = 'baremetal-linux' | 'bsd' | 'linux' | 'windows';

export type TDeploymentModeDTO = {
  name: TRegionDeploymentModeDTO;
  tags: string[] | null;
};

export type TRegionDTO = {
  name: string;
  country: string | null;
  availabilityZones: string[];
  datacenter: string;
  filters: {
    deployment: string[];
    region: string[];
  };
  isActivable: boolean;
  isActivated: boolean;
  isInMaintenance: boolean;
  type: TRegionDeploymentModeDTO;
};

export type TContinentRegionsDTO = {
  name: string;
  regions: string[];
  tags: string[] | null;
};

export type TFlavorSubCategoryDTO = {
  name: string;
  flavors: string[];
  tags: string[] | null;
};

export type TFlavorCategoryDTO = {
  name: string;
  subCategories: TFlavorSubCategoryDTO[];
  tags: string[] | null;
};

type TFiltersDTO = {
  deployments: TDeploymentModeDTO[];
  regions: TContinentRegionsDTO[];
  categories: TFlavorCategoryDTO[];
};

export type TSpecDetailsDTO = {
  unit: string;
  value: number;
};

export type TSpecificationsDTO = {
  cpu: TSpecDetailsDTO;
  ram: TSpecDetailsDTO;
  storage: TSpecDetailsDTO;
  bandwidth: {
    public: TSpecDetailsDTO;
    private: TSpecDetailsDTO;
  };
};

export type TFlavorRegionDTO = {
  name: string;
  flavorId: string;
  osType: TOsTypeDTO;
  quota: number;
  availableStocks: boolean;
  tags: string[] | null;
};

type TPriceDetailsDTO = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export type TPriceDTO = {
  type: 'hour' | 'month' | 'licence';
  price: TPriceDetailsDTO;
  includeVat: boolean;
  monthlyEquivalent: TPriceDetailsDTO | null;
};

export type TPricingDTO = {
  regions: string[];
  osType: string;
  prices: TPriceDTO[];
};

export type TFlavorDTO = {
  name: string;
  specifications: TSpecificationsDTO;
  regions: TFlavorRegionDTO[];
  pricings: TPricingDTO[];
};

export type TImageRegionDTO = {
  name: string;
  imageId: string;
};

export type TImageDTO = {
  name: string;
  category: TImageCategoryDTO;
  subCategory: string;
  osType: TImageOsType;
  regions: TImageRegionDTO[];
};

export type TInstancesCatalogDTO = {
  filters: TFiltersDTO;
  regions: TRegionDTO[];
  flavors: TFlavorDTO[];
  images: TImageDTO[];
};
