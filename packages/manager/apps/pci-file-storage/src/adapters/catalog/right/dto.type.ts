export type TRegionDeploymentModeDTO = 'region' | 'localzone' | 'region-3-az';

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

export type TDeploymentModeDTO = {
  name: TRegionDeploymentModeDTO;
  tags: string[] | null;
};


export type TContinentRegionsDTO = {
  name: string;
  regions: string[];
  tags: string[] | null;
};

export type TFiltersDTO = {
  deployment: TDeploymentModeDTO[];
  region: TContinentRegionsDTO[];
};

export type TShareCatalogDTO = {
  filters: TFiltersDTO;
  regions: TRegionDTO[];
};
