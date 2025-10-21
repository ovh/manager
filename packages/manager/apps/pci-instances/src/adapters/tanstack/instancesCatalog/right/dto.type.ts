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

export type TInstancesCatalogDTO = {
  filters: TFiltersDTO;
  regions: TRegionDTO[];
};
