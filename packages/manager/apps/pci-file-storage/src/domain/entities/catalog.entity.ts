import { TCountryIsoCode } from '@/components/new-lib/flag/country-iso-code';

export const DEPLOYMENT_MODES = ['region', 'localzone', 'region-3-az'] as const;
export type TDeploymentMode = (typeof DEPLOYMENT_MODES)[number];

type TTags = string[] | null;

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
  tags: TTags;
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
  tags: TTags;
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
  };
  relations: {
    continentIdsByDeploymentModeId: Map<TDeploymentModeId, TContinentId[]>;
  };
};
