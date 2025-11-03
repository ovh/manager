export type TRegionDeploymentModeDTO = 'region' | 'localzone' | 'region-3-az';

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
  type: 'hour' | 'month';
  price: TPriceDetailsDTO;
  includeVat: boolean;
};

export type TPricingDTO = {
  regions: string[];
  prices: TPriceDTO[];
};

export type TFlavorDTO = {
  name: string;
  specifications: TSpecificationsDTO;
  regions: TFlavorRegionDTO[];
  pricings: TPricingDTO[];
  osType: string;
};

export type TInstancesCatalogDTO = {
  filters: TFiltersDTO;
  regions: TRegionDTO[];
  flavors: TFlavorDTO[];
};
