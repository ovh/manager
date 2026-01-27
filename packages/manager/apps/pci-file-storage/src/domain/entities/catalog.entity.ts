import { TCountryIsoCode } from '@/components/new-lib/flag/country-iso-code';

export const DEPLOYMENT_MODES = ['region', 'localzone', 'region-3-az'] as const;
export type TDeploymentMode = (typeof DEPLOYMENT_MODES)[number];

type TMacroRegionName = string;
type TMicroRegionName = string;
export type TMacroRegionId = TMacroRegionName;
export type TMicroRegionId = TMicroRegionName;
export type TDeploymentModeId = TDeploymentMode;

type TContinentName = string;
export type TContinentId = TContinentName;

export type TContinent = {
  name: TContinentName;
  macroRegionIds: TMacroRegionId[];
};

export type TMicroRegion = {
  name: TMicroRegionName;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
  macroRegionId: TMacroRegionId;
};

export type TMacroRegion = {
  name: TMacroRegionName;
  deploymentMode: TDeploymentModeId;
  continentIds: TContinentId[];
  country: TCountryIsoCode | null;
  microRegions: TMicroRegionId[];
};

export type TDeployment = {
  name: string;
};

export type TShareCapacity = {
  min: number;
  max: number;
};

export type TShareIOPS = {
  guaranteed: boolean;
  level: number;
  max: number;
  maxUnit: string;
  unit: string;
};

export type TShareBandwidth = {
  guaranteed: boolean;
  level: number;
  min: number;
  max: number;
  maxUnit: string;
  unit: string;
};

type TSharePricing = {
  price: number;
  interval: string;
};

export type TShareSpecs = {
  name: TShareSpecsName;
  capacity: TShareCapacity;
  iops: TShareIOPS;
  bandwidth: TShareBandwidth;
  microRegionIds: TMicroRegionId[];
  pricing: TSharePricing;
};

type TShareSpecsName = string;
export type TShareSpecsId = TShareSpecsName;

export type TShareName = string;
export type TShareId = TShareName;

export type TShare = {
  name: TShareName;
  filters: {
    deployment: TDeploymentModeId[];
  };
  specsIds: TShareSpecsId[];
};

export type TShareCatalog = {
  entities: {
    continents: {
      byId: Map<TContinentId, TContinent>;
      allIds: TContinentId[];
    };
    macroRegions: {
      byId: Map<TMacroRegionId, TMacroRegion>;
      allIds: TMacroRegionId[];
    };
    microRegions: {
      byId: Map<TMicroRegionId, TMicroRegion>;
      allIds: TMicroRegionId[];
    };
    deploymentModes: {
      byId: Map<TDeploymentModeId, TDeployment>;
      allIds: TDeploymentModeId[];
    };
    shares: {
      byId: Map<TShareId, TShare>;
      allIds: TShareId[];
    };
    shareSpecs: {
      byId: Map<TShareSpecsId, TShareSpecs>;
      allIds: TShareSpecsId[];
    };
  };
  relations: {
    continentIdsByDeploymentModeId: Map<TDeploymentModeId, TContinentId[]>;
  };
};
