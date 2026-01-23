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
  deployments: TDeploymentModeDTO[];
  regions: TContinentRegionsDTO[];
};

export type TShareCapacityDTO = {
  min: number;
  max: number;
};

export type TShareIOPSDTO = {
  guaranteed: boolean;
  level: number;
  max: number;
  maxUnit: string;
  unit: string;
};

export type TShareBandwidthDTO = {
  guaranteed: boolean;
  level: number;
  min: number;
  max: number;
  maxUnit: string;
  unit: string;
};

export type TShareShareDTO = {
  capacity: TShareCapacityDTO;
  iops: TShareIOPSDTO;
};

export type TShareSpecsDTO = {
  name: string;
  share: TShareShareDTO;
  bandwidth: TShareBandwidthDTO;
};

export type TSharePricingDTO = {
  regions: string[];
  price: number;
  interval: string;
  showAvailabilityZones: boolean;
  areIOPSDynamic: boolean;
  isBandwidthDynamic: boolean;
  specs: TShareSpecsDTO;
};

export type TShareDTO = {
  name: string;
  tags: string[];
  filters: {
    deployment: string[];
  };
  pricings: TSharePricingDTO[];
};

export type TShareCatalogDTO = {
  filters: TFiltersDTO;
  regions: TRegionDTO[];
  shares: TShareDTO[];
};
