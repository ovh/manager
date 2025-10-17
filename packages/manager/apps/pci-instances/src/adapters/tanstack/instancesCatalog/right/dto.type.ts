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
  tags: string[];
};

type TFiltersDTO = {
  deployments: TDeploymentModeDTO[];
  regions: TContinentRegionsDTO[];
};

export type TInstancesCatalogDTO = {
  filters: TFiltersDTO;
  regions: TRegionDTO[];
};
